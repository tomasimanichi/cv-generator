# .htaccess - Configuração Apache para CV Generator
# Habilitar mod_rewrite
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Remover a barra final das URLs
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.+)/$  $1 [L,R=301]
    
    # Redirecionar requisições para index.php
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . index.php [L]
</IfModule>

# Segurança - Desabilitar listagem de diretórios
Options -Indexes

# Segurança - Prevenir acesso a arquivos de configuração
<FilesMatch "\.php$|\.json$|\.env|\.git">
    Order allow,deny
    Deny from all
</FilesMatch>

# Compressão GZIP (melhor performance)
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache do navegador (arquivos estáticos)
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
    ExpiresByType application/x-javascript "access plus 1 week"
</IfModule>

# Headers de segurança
<IfModule mod_headers.c>
    # Prevenir clickjacking
    Header set X-Frame-Options "SAMEORIGIN"
    
    # Prevenir MIME-type sniffing
    Header set X-Content-Type-Options "nosniff"
    
    # Ativar XSS protection
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Permitir acesso aos arquivos de assets (CSS, JS, imagens)
<IfModule mod_rewrite.c>
    RewriteCond %{REQUEST_URI} ^/assets/
    RewriteRule ^ - [L]
</IfModule>

# Bloquear acesso a arquivos específicos
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>
