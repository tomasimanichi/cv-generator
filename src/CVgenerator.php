<?php

namespace App;

use Mpdf\Mpdf;
use Mpdf\MpdfException;

class CVGenerator
{
    private string $templatePath;
    private array $data = [];

    public function __construct()
    {
        $this->templatePath = __DIR__ . '/../templates/cv-template.html';
    }

    /**
     * Define os dados do currículo
     *
     * @param array $data Dados do formulário
     */
    public function setData(array $data): void
    {
        $this->data = $data;
    }

    /**
     * Gera o PDF do currículo
     *
     * @return string Conteúdo do PDF (string)
     * @throws MpdfException
     */
    public function generatePDF(): string
    {
        // Carrega template HTML
        $template = file_get_contents($this->templatePath);

        // Preenche template com dados
        $html = $this->fillTemplate($template);

        // Configuração do mPDF
        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 20,
            'margin_bottom' => 20,
            'margin_header' => 10,
            'margin_footer' => 10
        ]);

        // Adiciona CSS customizado
        $cssPath = __DIR__ . '/../public/assets/css/cv-template.css';
        if (file_exists($cssPath)) {
            $css = file_get_contents($cssPath);
            $mpdf->WriteHTML($css, \Mpdf\HTMLParserMode::HEADER_CSS);
        }

        // Escreve o HTML
        $mpdf->WriteHTML($html);

        // Retorna o PDF como string (para download)
        return $mpdf->Output('', 'S');
    }

    /**
     * Preenche o template HTML com os dados recebidos
     *
     * @param string $template Template HTML bruto
     * @return string HTML preenchido
     */
    private function fillTemplate(string $template): string
    {
        $replaceMap = [
            '{{name}}' => $this->data['name'] ?? '',
            '{{email}}' => $this->data['email'] ?? '',
            '{{phone}}' => $this->data['phone'] ?? '',
            '{{address}}' => $this->data['address'] ?? '',
            '{{objective}}' => $this->data['objective'] ?? '',
            '{{age}}' => $this->data['age'] ?? '',
            '{{course}}' => $this->data['course'] ?? '',
            '{{institution}}' => $this->data['institution'] ?? '',
            '{{graduation_year}}' => $this->data['graduation_year'] ?? '',
        ];

        // Substitui campos simples
        foreach ($replaceMap as $key => $value) {
            $template = str_replace($key, htmlspecialchars($value), $template);
        }

        // Processa experiências e referências
        $template = str_replace('{{experiences}}', $this->buildExperiences(), $template);
        $template = str_replace('{{references}}', $this->buildReferences(), $template);

        return $template;
    }

    /**
     * Constrói o HTML das experiências profissionais
     *
     * @return string
     */
    private function buildExperiences(): string
    {
        $html = '';
        if (empty($this->data['company']) || !is_array($this->data['company'])) {
            return $html;
        }

        $companies = $this->data['company'];
        $positions = $this->data['position'] ?? [];
        $startDates = $this->data['exp_start'] ?? [];
        $endDates = $this->data['exp_end'] ?? [];
        $descriptions = $this->data['exp_description'] ?? [];

        foreach ($companies as $index => $company) {
            if (empty(trim($company))) {
                continue;
            }

            $position = $positions[$index] ?? '';
            $startDate = $this->formatDate($startDates[$index] ?? '');
            $endDate = $this->formatDate($endDates[$index] ?? '') ?: 'Atual';
            $description = $descriptions[$index] ?? '';

            $html .= "<div class='experience-item'>\n";
            $html .= "<h4>" . htmlspecialchars($company) . "</h4>\n";
            $html .= "<p><em>" . htmlspecialchars($position) . "</em></p>\n";
            $html .= "<p>" . htmlspecialchars($startDate) . " - " . htmlspecialchars($endDate) . "</p>\n";
            $html .= "<p>" . nl2br(htmlspecialchars($description)) . "</p>\n";
            $html .= "</div>\n";
        }

        return $html;
    }

    /**
     * Constrói o HTML das referências pessoais
     *
     * @return string
     */
    private function buildReferences(): string
    {
        $html = '';
        if (empty($this->data['ref_name']) || !is_array($this->data['ref_name'])) {
            return $html;
        }

        $names = $this->data['ref_name'];
        $positions = $this->data['ref_position'] ?? [];
        $companies = $this->data['ref_company'] ?? [];
        $phones = $this->data['ref_phone'] ?? [];
        $emails = $this->data['ref_email'] ?? [];

        foreach ($names as $index => $name) {
            if (empty(trim($name))) {
                continue;
            }

            $position = $positions[$index] ?? '';
            $company = $companies[$index] ?? '';
            $phone = $phones[$index] ?? '';
            $email = $emails[$index] ?? '';

            $html .= "<div class='reference-item'>\n";
            $html .= "<p><strong>" . htmlspecialchars($name) . "</strong></p>\n";
            $html .= "<p>" . htmlspecialchars($position) . " - " . htmlspecialchars($company) . "</p>\n";
            $html .= "<p>Tel: " . htmlspecialchars($phone) . " | Email: " . htmlspecialchars($email) . "</p>\n";
            $html .= "</div>\n";
        }

        return $html;
    }

    /**
     * Formata data no formato YYYY-MM-DD para MM/YYYY
     *
     * @param string $date
     * @return string
     */
    private function formatDate(string $date): string
    {
        if (empty($date)) {
            return '';
        }
        $timestamp = strtotime($date);
        if ($timestamp === false) {
            return $date; // Retorna original se inválida
        }
        return date('m/Y', $timestamp);
    }
}
