<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use DateTime;

class SoftDeleteProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $persistProcessor
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        // Solo aplicamos soft delete si la entidad tiene los métodos setDeleted y setDeletedAt
        if (method_exists($data, 'setDeleted') && method_exists($data, 'setDeletedAt')) {
            $data->setDeleted(true);
            $data->setDeletedAt(new DateTime());

            // Usamos el persist processor para guardar los cambios (UPDATE)
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        // Si no soporta soft delete, no hacemos nada (o podríamos lanzar excepción)
        return null;
    }
}
