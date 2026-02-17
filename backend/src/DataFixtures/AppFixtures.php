<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Product;
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
        $now = new \DateTimeImmutable();

        // --- USERS ---
        // Crear Admin
        $admin = new User();
        $admin->setEmail('admin@example.com');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setAddress('Calle Admin 123');
        $admin->setPhone(123456789);
        $admin->setCreatedAt($now);
        $admin->setDeleted(false);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $manager->persist($admin);

        // Crear Usuario normal
        $user = new User();
        $user->setEmail('user@example.com');
        $user->setRoles(['ROLE_USER']);
        $user->setAddress('Avenida Usuario 456');
        $user->setPhone(987654321);
        $user->setCreatedAt($now);
        $user->setDeleted(false);
        $user->setPassword($this->passwordHasher->hashPassword($user, 'user123'));
        $manager->persist($user);

        // Crear Invitado
        $guest = new User();
        $guest->setEmail('guest@example.com');
        $guest->setRoles(['ROLE_GUEST']);
        $guest->setAddress('Plaza Invitado 789');
        $guest->setPhone(555555555);
        $guest->setCreatedAt($now);
        $guest->setDeleted(false);
        $guest->setPassword($this->passwordHasher->hashPassword($guest, 'guest123'));
        $manager->persist($guest);

        // --- CATEGORIES ---
        $electronics = new Category();
        $electronics->setName('Electronics');
        $electronics->setCreatedAt($now);
        $electronics->setDeleted(false);
        $manager->persist($electronics);

        $books = new Category();
        $books->setName('Books');
        $books->setCreatedAt($now);
        $books->setDeleted(false);
        $manager->persist($books);

        // --- PRODUCTS ---
        $product1 = new Product();
        $product1->setName('Smartphone X');
        $product1->setDescription('Latest model with high-res camera');
        $product1->setPrice(999.99);
        $product1->setStock(50);
        $product1->setCategory($electronics);
        $product1->setCreatedAt($now);
        $product1->setDeleted(false);
        $manager->persist($product1);

        $product2 = new Product();
        $product2->setName('Laptop Pro');
        $product2->setDescription('Powerful laptop for developers');
        $product2->setPrice(1499.50);
        $product2->setStock(20);
        $product2->setCategory($electronics);
        $product2->setCreatedAt($now);
        $product2->setDeleted(false);
        $manager->persist($product2);

        $product3 = new Product();
        $product3->setName('Symfony Guide');
        $product3->setDescription('The best book to learn Symfony');
        $product3->setPrice(29.99);
        $product3->setStock(100);
        $product3->setCategory($books);
        $product3->setCreatedAt($now);
        $product3->setDeleted(false);
        $manager->persist($product3);

        $manager->flush();
    }
}
