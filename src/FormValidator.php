<?php
namespace App;

class FormValidator {
    private array $errors = [];

    /**
     * Valida os dados do formulário.
     * @param array $data Dados brutos do formulário
     * @return bool Retorna verdadeiro se os dados forem válidos
     */
    public function validate(array $data): bool {
        $this->errors = [];
        // Validar nome
        if (empty($data['name'])) {
            $this->errors[] = "Nome é obrigatório";
        } elseif (strlen(trim($data['name'])) < 3) {
            $this->errors[] = "Nome deve ter pelo menos 3 caracteres";
        }

        // Validar email
        if (empty($data['email'])) {
            $this->errors[] = "Email é obrigatório";
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = "Email inválido";
        }

        // Validar data de nascimento
        if (empty($data['dob'])) {
            $this->errors[] = "Data de nascimento é obrigatória";
        } else {
            $age = $this->calculateAge($data['dob']);
            if ($age < 16) {
                $this->errors[] = "Idade mínima: 16 anos";
            } elseif ($age > 100) {
                $this->errors[] = "Verifique a data de nascimento";
            }
        }
        return empty($this->errors);
    }

    /**
     * Retorna os erros encontrados na validação
     * @return array
     */
    public function getErrors(): array {
        return $this->errors;
    }

    /**
     * Sanitiza os dados de entrada do formulário
     * @param array $data
     * @return array Dados limpos
     */
    public function sanitize(array $data): array {
        $sanitized = [];
        // Dados de texto simples
        $textFields = ['name', 'phone', 'address', 'objective', 'course', 'institution'];
        foreach ($textFields as $field) {
            $sanitized[$field] = isset($data[$field]) ? htmlspecialchars(trim($data[$field]), ENT_QUOTES, 'UTF-8') : '';
        }
        // Email
        $sanitized['email'] = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
        // Datas e números
        $sanitized['dob'] = isset($data['dob']) ? $data['dob'] : '';
        $sanitized['age'] = isset($data['age']) ? intval($data['age']) : 0;
        $sanitized['graduation_year'] = isset($data['graduation_year']) ? intval($data['graduation_year']) : 0;
        // Arrays (experiências, referências)
        $arrayFields = [
            'company', 'position', 'exp_start', 'exp_end', 'exp_description',
            'ref_name', 'ref_position', 'ref_company', 'ref_phone', 'ref_email'
        ];
        foreach ($arrayFields as $field) {
            if (isset($data[$field]) && is_array($data[$field])) {
                $sanitized[$field] = array_map(function($item) {
                    return htmlspecialchars(trim($item), ENT_QUOTES, 'UTF-8');
                }, $data[$field]);
            } else {
                $sanitized[$field] = [];
            }
        }
        return $sanitized;
    }

    /**
     * Calcula a idade a partir da data de nascimento
     * @param string $dob Data no formato YYYY-MM-DD
     * @return int
     */
    private function calculateAge(string $dob): int {
        if (empty($dob)) return 0;
        $birthDate = new \DateTime($dob);
        $today = new \DateTime();
        $age = $today->diff($birthDate)->y;
        return $age;
    }
}
