<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Order;
use App\Entity\OrderProduct;
use App\Entity\Product;
use App\Entity\Review;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $placeholder = '/products/placeholder.avif';

        // --- USUARIOS ---
        $admin = new User();
        $admin->setEmail('admin@example.com');
        $admin->setName('Grow Master Admin');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $admin->setAddress('Calle del Humo 420, Madrid');
        $manager->persist($admin);

        $user = new User();
        $user->setEmail('user@example.com');
        $user->setName('Juan Cultivador');
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordHasher->hashPassword($user, 'user123'));
        $user->setAddress('Avenida de la Resina 7, Barcelona');
        $manager->persist($user);

        // --- CATEGORÍAS Y PRODUCTOS ---

        $categoriesData = [
            'Semillas' => [
                ['name' => 'Amnesia Haze (3 uds)', 'desc' => 'Semillas feminizadas de alta calidad con sabor cítrico.', 'price' => '25.50', 'stock' => 100],
                ['name' => 'Northern Lights Auto (5 uds)', 'desc' => 'Variedad autofloreciente clásica, ideal para principiantes.', 'price' => '35.00', 'stock' => 50],
                ['name' => 'OG Kush Feminizada', 'desc' => 'La leyenda californiana, potente y resinosa.', 'price' => '28.00', 'stock' => 80]
            ],
            'Cultivo' => [
                ['name' => 'Armario de Cultivo 100x100', 'desc' => 'Armario robusto y reflectante para interior.', 'price' => '120.00', 'stock' => 20],
                ['name' => 'Maceta Textil 11L', 'desc' => 'Mejora la aireación de las raíces.', 'price' => '4.50', 'stock' => 150],
                ['name' => 'Tijeras de Poda Curvas', 'desc' => 'Precisión para manicurado.', 'price' => '12.90', 'stock' => 60]
            ],
            'Parafernalia' => [
                ['name' => 'Bong de Vidrio 30cm', 'desc' => 'Bong de borosilicato resistente con percolador.', 'price' => '45.90', 'stock' => 15],
                ['name' => 'Grinder Metálico 4 partes', 'desc' => 'Grinder de aluminio con polinizador y espátula.', 'price' => '12.00', 'stock' => 200],
                ['name' => 'Papel Raw King Size', 'desc' => 'Papel de liar natural sin blanquear.', 'price' => '1.50', 'stock' => 500]
            ],
            'Iluminación' => [
                ['name' => 'Panel LED 200W Full Spectrum', 'desc' => 'Iluminación eficiente para crecimiento y floración.', 'price' => '180.00', 'stock' => 10],
                ['name' => 'Bombilla HPS 600W', 'desc' => 'Clásica bombilla de sodio para floración explosiva.', 'price' => '35.00', 'stock' => 40],
                ['name' => 'Temporizador Analógico', 'desc' => 'Controla tus ciclos de luz fácilmente.', 'price' => '6.50', 'stock' => 100]
            ],
            'Fertilizantes' => [
                ['name' => 'Kit Fertilizantes Orgánicos', 'desc' => 'Pack completo para crecimiento y floración.', 'price' => '29.95', 'stock' => 30],
                ['name' => 'Estimulador de Raíces 500ml', 'desc' => 'Potencia el sistema radicular.', 'price' => '15.00', 'stock' => 50],
                ['name' => 'PK 13/14 1L', 'desc' => 'Potenciador de floración mineral.', 'price' => '12.50', 'stock' => 45]
            ],
            'Sustratos' => [
                ['name' => 'Sustrato All Mix 50L', 'desc' => 'Tierra pre-abonada de alta calidad.', 'price' => '18.50', 'stock' => 40],
                ['name' => 'Coco Mix 50L', 'desc' => 'Fibra de coco lavada y tamponada.', 'price' => '14.00', 'stock' => 35],
                ['name' => 'Perlita 10L', 'desc' => 'Mejora el drenaje y la aireación.', 'price' => '5.00', 'stock' => 80]
            ],
            'Control de Clima' => [
                ['name' => 'Extractor en Línea 125mm', 'desc' => 'Ventilación básica para armarios pequeños.', 'price' => '25.00', 'stock' => 25],
                ['name' => 'Filtro de Carbón Antiolor', 'desc' => 'Elimina olores indeseados eficazmente.', 'price' => '45.00', 'stock' => 20],
                ['name' => 'Termohigrómetro Digital', 'desc' => 'Mide temperatura y humedad con precisión.', 'price' => '10.00', 'stock' => 100]
            ],
            'Cosecha y Secado' => [
                ['name' => 'Malla de Secado 8 pisos', 'desc' => 'Seca tu cosecha en poco espacio.', 'price' => '18.00', 'stock' => 30],
                ['name' => 'Microscopio 60x LED', 'desc' => 'Controla la maduración de los tricomas.', 'price' => '8.50', 'stock' => 50],
                ['name' => 'Botes de Curado Herméticos', 'desc' => 'Conserva tus flores en perfecto estado.', 'price' => '12.00', 'stock' => 60]
            ],
            'Vaporizadores' => [
                ['name' => 'Vaporizador Portátil Pro', 'desc' => 'Vaporización por convección, sabor puro.', 'price' => '99.00', 'stock' => 15],
                ['name' => 'Vaporizador de Mesa', 'desc' => 'Potencia y precisión para sesiones largas.', 'price' => '250.00', 'stock' => 5],
                ['name' => 'Bolsas de Recambio', 'desc' => 'Pack de 5 bolsas para vaporizador.', 'price' => '15.00', 'stock' => 40]
            ],
            'CBD y Cosmética' => [
                ['name' => 'Aceite CBD 10% 10ml', 'desc' => 'Aceite Full Spectrum de alta calidad.', 'price' => '35.00', 'stock' => 50],
                ['name' => 'Crema Alivio Muscular CBD', 'desc' => 'Bálsamo recuperador con efecto frío/calor.', 'price' => '22.00', 'stock' => 30],
                ['name' => 'Flores CBD Amnesia 2g', 'desc' => 'Cogollos aromáticos sin THC.', 'price' => '10.00', 'stock' => 100]
            ]
        ];

        $allProducts = [];

        foreach ($categoriesData as $catName => $products) {
            $category = new Category();
            $category->setName($catName);
            $category->setPicture('/mj-star.svg');
            $manager->persist($category);

            // 1. Añadir productos fijos
            foreach ($products as $pData) {
                $product = new Product();
                $product->setName($pData['name']);
                $product->setDescription($pData['desc']);
                $product->setPrice($pData['price']);
                $product->setStock($pData['stock']);
                $product->setCategory($category);
                $product->setPicture($placeholder);
                $manager->persist($product);
                $allProducts[] = $product;
            }

            // 2. Rellenar hasta 10 productos
            $currentCount = count($products);
            for ($i = $currentCount + 1; $i <= 10; $i++) {
                $product = new Product();
                $product->setName("$catName Genérico #$i");
                $product->setDescription("Descripción del producto genérico de la categoría $catName.");
                $product->setPrice((string)rand(5, 100));
                $product->setStock(rand(0, 50));
                $product->setCategory($category);
                $product->setPicture($placeholder);
                $manager->persist($product);
                $allProducts[] = $product;
            }
        }

        // --- RESEÑAS (REVIEWS) ---
        $usedReviews = [];

        // Buscamos el Bong para añadirle la review específica
        $bong = null;
        foreach ($allProducts as $p) {
            if ($p->getName() === 'Bong de Vidrio 30cm') {
                $bong = $p;
                break;
            }
        }

        if ($bong) {
            $review = new Review();
            $review->setUser($user);
            $review->setProduct($bong);
            $review->setRating(5);
            $review->setComment('¡Increíble bong! Enfría el humo perfectamente.');
            $manager->persist($review);
            $usedReviews[$user->getEmail() . '-' . $bong->getName()] = true;
        }

        // Añadir reviews aleatorias sin colisiones
        $reviewCount = 0;
        $maxReviews = 30; // Aumentamos reviews
        $attempts = 0;

        while ($reviewCount < $maxReviews && $attempts < 200) {
            $attempts++;
            $targetUser = rand(0, 1) === 0 ? $user : $admin;
            $targetProduct = $allProducts[array_rand($allProducts)];

            $key = $targetUser->getEmail() . '-' . $targetProduct->getName();

            if (isset($usedReviews[$key])) {
                continue;
            }

            $review = new Review();
            $review->setUser($targetUser);
            $review->setProduct($targetProduct);
            $review->setRating(rand(3, 5));
            $review->setComment('Buen producto, cumple su función.');
            $manager->persist($review);

            $usedReviews[$key] = true;
            $reviewCount++;
        }

        // --- PEDIDOS (ORDERS) ---
        $order = new Order();
        $order->setUser($user);
        $order->setTotal('57.90');
        $order->setState('COMPLETED');
        $manager->persist($order);

        // Productos del pedido (Bong y Grinder si existen)
        $grinder = null;
        foreach ($allProducts as $p) {
            if ($p->getName() === 'Grinder Metálico 4 partes') {
                $grinder = $p;
                break;
            }
        }

        if ($bong) {
            $op1 = new OrderProduct();
            $op1->setOrder($order);
            $op1->setProduct($bong);
            $op1->setQuantity(1);
            $op1->setUnitPrice('45.90');
            $manager->persist($op1);
        }

        if ($grinder) {
            $op2 = new OrderProduct();
            $op2->setOrder($order);
            $op2->setProduct($grinder);
            $op2->setQuantity(1);
            $op2->setUnitPrice('12.00');
            $manager->persist($op2);
        }

        // Añadir algunos pedidos aleatorios
        for ($i = 0; $i < 10; $i++) { // Aumentamos pedidos
            $randOrder = new Order();
            $randOrder->setUser($user);
            $randOrder->setTotal((string)rand(20, 200));
            $randOrder->setState(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'][rand(0, 4)]);
            $manager->persist($randOrder);

            $op = new OrderProduct();
            $op->setOrder($randOrder);
            $op->setProduct($allProducts[array_rand($allProducts)]);
            $op->setQuantity(rand(1, 3));
            $op->setUnitPrice('10.00');
            $manager->persist($op);
        }

        $manager->flush();
    }
}
