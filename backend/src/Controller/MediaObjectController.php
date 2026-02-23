<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[Route('/api/media_objects')]
class MediaObjectController extends AbstractController
{
    #[Route('', methods: ['POST'])]
    public function upload(Request $request, SluggerInterface $slugger): JsonResponse
    {
        /** @var UploadedFile $file */
        $file = $request->files->get('file');

        if (!$file) {
            return new JsonResponse(['error' => 'No file uploaded'], 400);
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

        // Directorio destino: public/products
        $destination = $this->getParameter('kernel.project_dir').'/public/products';

        try {
            $file->move($destination, $newFilename);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Could not save file'], 500);
        }

        // Devolver la URL relativa
        return new JsonResponse([
            'url' => '/products/'.$newFilename
        ], 201);
    }
}
