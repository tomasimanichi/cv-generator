<?php
/**
 * Script de geração de PDF do currículo
 * Arquivo: public/generate.php
 * 
 * Este arquivo recebe os dados do formulário, valida, sanitiza
 * e gera um PDF do currículo usando a classe CVGenerator.
 */

// Incluir autoloader do Composer (carrega as classes automaticamente)
require_once __DIR__ . '/../vendor/autoload.php';

use App\FormValidator;
use App\CVGenerator;

/**
 * Verificar se o formulário foi enviado via POST
 */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Erro 405: Método não permitido. Use o formulário para enviar os dados.');
}

try {
    // Instanciar o validador
    $validator = new FormValidator();
    
    // Capturar dados do formulário ($_POST)
    $data = $_POST;
    
    /**
     * Validar os dados
     */
    if (!$validator->validate($data)) {
        // Se houver erros de validação, retorne os erros
        $erros = $validator->getErrors();
        http_response_code(400);
        
        // Retornar erros em JSON (para facilitar tratamento no frontend)
        header('Content-Type: application/json');
        echo json_encode([
            'sucesso' => false,
            'erros' => $erros
        ]);
        exit;
    }
    
    /**
     * Se os dados forem válidos, limpe eles
     */
    $data = $validator->sanitize($data);
    
    /**
     * Instanciar o gerador de CV
     */
    $cvGenerator = new CVGenerator();
    $cvGenerator->setData($data);
    
    /**
     * Gerar o PDF
     */
    $pdfContent = $cvGenerator->generatePDF();
    
    /**
     * Enviar o PDF para download
     */
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="curriculo_' . date('Y-m-d_H-i-s') . '.pdf"');
    header('Content-Length: ' . strlen($pdfContent));
    header('Cache-Control: private, max-age=0, must-revalidate');
    header('Pragma: public');
    header('Expires: 0');
    
    echo $pdfContent;
    exit;
    
} catch (Exception $e) {
    /**
     * Se houver algum erro não previsto
     */
    http_response_code(500);
    header('Content-Type: application/json');
    
    echo json_encode([
        'sucesso' => false,
        'erro' => 'Erro ao gerar currículo: ' . $e->getMessage()
    ]);
    
    // Registrar erro em log
    error_log('Erro em generate.php: ' . $e->getMessage());
    exit;
}
