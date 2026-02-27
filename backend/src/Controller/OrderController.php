<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderProduct;
use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class OrderController extends AbstractController
{
    #[Route('/api/checkout', name: 'api_checkout', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function checkout(
        Request $request,
        EntityManagerInterface $entityManager,
        ProductRepository $productRepository
    ): JsonResponse
    {
        try {
            $user = $this->getUser();
            $content = $request->getContent();
            error_log("Checkout request content: " . $content); // LOG

            $data = json_decode($content, true);

            if (!isset($data['items']) || !is_array($data['items']) || empty($data['items'])) {
                error_log("Checkout error: Carrito vacío o formato inválido"); // LOG
                return $this->json(['message' => 'El carrito está vacío'], 400);
            }

            $order = new Order();
            $order->setUser($user);
            $order->setState('COMPLETED');
            // $order->setCreatedAt(new \DateTime()); // Esto ya lo hace el constructor o lifecycle callback

            $total = 0;

            foreach ($data['items'] as $item) {
                $productId = $item['id'] ?? $item['productId'];
                $quantity = $item['quantity'];

                error_log("Procesando producto ID: $productId, Cantidad: $quantity"); // LOG

                $product = $productRepository->find($productId);

                if (!$product) {
                    error_log("Checkout error: Producto $productId no encontrado"); // LOG
                    return $this->json(['message' => "Producto con ID $productId no encontrado"], 404);
                }

                if ($product->getStock() < $quantity) {
                    error_log("Checkout error: Stock insuficiente para {$product->getName()}"); // LOG
                    return $this->json(['message' => "Stock insuficiente para {$product->getName()}"], 400);
                }

                // Restar stock
                $product->setStock($product->getStock() - $quantity);

                // Crear línea de pedido
                $orderProduct = new OrderProduct();
                $orderProduct->setOrder($order);
                $orderProduct->setProduct($product);
                $orderProduct->setQuantity($quantity);
                $orderProduct->setUnitPrice($product->getPrice());

                $entityManager->persist($orderProduct);

                $total += $product->getPrice() * $quantity;
            }

            // Aplicar gastos de envío
            $shippingCost = $total > 50 ? 0 : 5.99;
            $order->setTotal((string)($total + $shippingCost));

            $entityManager->persist($order);
            $entityManager->flush();

            error_log("Checkout éxito: Pedido creado con ID " . $order->getId()); // LOG

            return $this->json([
                'message' => 'Pedido creado correctamente',
                'orderId' => $order->getId(),
                'total' => $order->getTotal()
            ], 201);

        } catch (\Exception $e) {
            error_log("Checkout EXCEPTION: " . $e->getMessage()); // LOG CRÍTICO
            error_log($e->getTraceAsString());
            return $this->json(['message' => 'Error interno del servidor: ' . $e->getMessage()], 500);
        }
    }
}
