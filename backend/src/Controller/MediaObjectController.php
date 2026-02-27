<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/media_objects')]
class MediaObjectController extends AbstractController
{
    #[Route('', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        try {
            $file = $request->files->get('file');

            if (!$file) {
                return new JsonResponse(['error' => 'No file uploaded'], 400);
            }

            // Nombre único simple
            $newFilename = uniqid() . '.' . $file->guessExtension();

            // Ruta destino
            $destination = $this->getParameter('kernel.project_dir') . '/public/products';

            // Asegurar que el directorio existe
            if (!is_dir($destination)) {
                mkdir($destination, 0777, true);
            }

            // Mover archivo
            $file->move($destination, $newFilename);

            return new JsonResponse([
                'url' => '/products/' . $newFilename
            ], 201);

        } catch (\Throwable $e) {
            // Capturar cualquier error y devolverlo como JSON para debug
            return new JsonResponse([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
