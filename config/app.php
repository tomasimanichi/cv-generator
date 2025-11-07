<?php

return [
    // Informações da aplicação
    'name' => 'Gerador de Currículos',
    'version' => '1.0.0',
    'author' => 'Tomás do Amaral',
    'email' => 'tomasdoamaral@gmail.com',
    
    // URL base
    'url' => 'http://localhost/cv-generator',
    
    // Timezone
    'timezone' => 'America/Sao_Paulo',
    
    // Modo debug
    'debug' => true,
    
    // Configurações de PDF
    'pdf' => [
        'format' => 'A4',
        'margin_left' => 15,
        'margin_right' => 15,
        'margin_top' => 20,
        'margin_bottom' => 20,
        'margin_header' => 10,
        'margin_footer' => 10,
    ],
    
    // Validações
    'validation' => [
        'min_age' => 16,
        'max_age' => 100,
        'min_name_length' => 3,
        'max_objective_length' => 500,
    ],
    
    // Arquivos permitidos
    'upload' => [
        'allowed_types' => ['jpg', 'jpeg', 'png', 'gif'],
        'max_size' => 5242880, // 5MB em bytes
        'upload_path' => __DIR__ . '/../uploads/',
    ],
];
