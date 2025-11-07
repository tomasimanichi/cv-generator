<?php
namespace App;

use Mpdf\Mpdf;
use Mpdf\MpdfException;

/**
 * Wrapper para geração de PDF usando mPDF
 * Arquivo: src/PDFGenerator.php
 */
class PDFGenerator
{
    private Mpdf $mpdf;
    private array $config;
    
    /**
     * Construtor do PDFGenerator
     * 
     * @param array $config Configurações customizadas para o PDF
     * @throws MpdfException
     */
    public function __construct(array $config = [])
    {
        // Carregar configurações padrão
        $this->config = $config ?: $this->getDefaultConfig();
        
        // Inicializar mPDF
        try {
            $this->mpdf = new Mpdf($this->config);
        } catch (MpdfException $e) {
            throw new MpdfException('Erro ao inicializar mPDF: ' . $e->getMessage());
        }
    }
    
    /**
     * Adiciona CSS ao PDF
     * 
     * @param string $css Conteúdo CSS
     * @return void
     */
    public function addCSS(string $css): void
    {
        try {
            $this->mpdf->WriteHTML($css, \Mpdf\HTMLParserMode::HEADER_CSS);
        } catch (MpdfException $e) {
            throw new MpdfException('Erro ao adicionar CSS: ' . $e->getMessage());
        }
    }
    
    /**
     * Adiciona HTML ao PDF
     * 
     * @param string $html Conteúdo HTML
     * @return void
     */
    public function addHTML(string $html): void
    {
        try {
            $this->mpdf->WriteHTML($html);
        } catch (MpdfException $e) {
            throw new MpdfException('Erro ao adicionar HTML: ' . $e->getMessage());
        }
    }
    
    /**
     * Define o título do documento
     * 
     * @param string $title Título
     * @return void
     */
    public function setTitle(string $title): void
    {
        $this->mpdf->SetTitle($title);
    }
    
    /**
     * Define o autor do documento
     * 
     * @param string $author Autor
     * @return void
     */
    public function setAuthor(string $author): void
    {
        $this->mpdf->SetAuthor($author);
    }
    
    /**
     * Gera o PDF como string
     * 
     * @return string Conteúdo do PDF em bytes
     */
    public function output(): string
    {
        return $this->mpdf->Output('', 'S');
    }
    
    /**
     * Salva o PDF em arquivo
     * 
     * @param string $filename Caminho e nome do arquivo
     * @return void
     */
    public function save(string $filename): void
    {
        $this->mpdf->Output($filename, 'F');
    }
    
    /**
     * Configurações padrão do PDF
     * 
     * @return array
     */
    private function getDefaultConfig(): array
    {
        return [
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 20,
            'margin_bottom' => 20,
            'margin_header' => 10,
            'margin_footer' => 10,
        ];
    }
    
    /**
     * Retorna a instância do mPDF
     * 
     * @return Mpdf
     */
    public function getMpdf(): Mpdf
    {
        return $this->mpdf;
    }
}
