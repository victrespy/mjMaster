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

        // --- CATEGORÍAS ---
        $catSemillas = new Category();
        $catSemillas->setName('Semillas');
        $manager->persist($catSemillas);

        $catParafernalia = new Category();
        $catParafernalia->setName('Parafernalia');
        $manager->persist($catParafernalia);

        $catCultivo = new Category();
        $catCultivo->setName('Cultivo');
        $manager->persist($catCultivo);

        // --- PRODUCTOS ---
        // Semillas
        $prod1 = new Product();
        $prod1->setName('Amnesia Haze (3 uds)');
        $prod1->setDescription('Semillas feminizadas de alta calidad con sabor cítrico.');
        $prod1->setPrice('25.50');
        $prod1->setStock(100);
        $prod1->setCategory($catSemillas);
        $manager->persist($prod1);

        $prod2 = new Product();
        $prod2->setName('Northern Lights Auto (5 uds)');
        $prod2->setDescription('Variedad autofloreciente clásica, ideal para principiantes.');
        $prod2->setPrice('35.00');
        $prod2->setStock(50);
        $prod2->setCategory($catSemillas);
        $manager->persist($prod2);

        // Parafernalia
        $prod3 = new Product();
        $prod3->setName('Bong de Vidrio 30cm');
        $prod3->setDescription('Bong de borosilicato resistente con percolador.');
        $prod3->setPrice('45.90');
        $prod3->setStock(15);
        $prod3->setCategory($catParafernalia);
        $manager->persist($prod3);

        $prod4 = new Product();
        $prod4->setName('Grinder Metálico 4 partes');
        $prod4->setDescription('Grinder de aluminio con polinizador y espátula.');
        $prod4->setPrice('12.00');
        $prod4->setStock(200);
        $prod4->setCategory($catParafernalia);
        $manager->persist($prod4);

        // Cultivo
        $prod5 = new Product();
        $prod5->setName('Kit Fertilizantes Orgánicos');
        $prod5->setDescription('Pack completo para crecimiento y floración.');
        $prod5->setPrice('29.95');
        $prod5->setStock(30);
        $prod5->setCategory($catCultivo);
        $manager->persist($prod5);

        // --- RESEÑAS (REVIEWS) ---
        $review = new Review();
        $review->setUser($user);
        $review->setProduct($prod3);
        $review->setRating(5);
        $review->setComment('¡Increíble bong! Enfría el humo perfectamente.');
        $manager->persist($review);

        // --- PEDIDOS (ORDERS) ---
        $order = new Order();
        $order->setUser($user);
        $order->setTotal('57.90');
        $order->setState('COMPLETED');
        $manager->persist($order);

        // Productos del pedido
        $op1 = new OrderProduct();
        $op1->setOrder($order);
        $op1->setProduct($prod3); // Bong
        $op1->setQuantity(1);
        $op1->setUnitPrice('45.90');
        $manager->persist($op1);

        $op2 = new OrderProduct();
        $op2->setOrder($order);
        $op2->setProduct($prod4); // Grinder
        $op2->setQuantity(1);
        $op2->setUnitPrice('12.00');
        $manager->persist($op2);

        $manager->flush();
    }
}
