// Validação de formulário usando estilo do Bootstrap
(function() {
	'use strict';
	window.addEventListener('load', function() {
		// Buscar todos os formulários que precisam de validação
		var forms = document.getElementsByClassName('needs-validation');

		// Aplicar listener de submit para cada formulário
		Array.prototype.forEach.call(forms, function(form) {
			form.addEventListener('submit', function(event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}
				// Adiciona classe para mostrar feedback do bootstrap
				form.classList.add('was-validated');
			}, false);
		});
	}, false);
})();

document.addEventListener('input', function (e) {
	var target = e.target;
	if (!target || !target.matches || !target.matches('input[type="tel"]')) return;

	var value = target.value.replace(/\D/g, '');

	if (value.length > 2) {
		value = value.replace(/^([0-9]{2})([0-9]+)$/, '($1) $2');
		if (value.replace(/\D/g, '').length > 10) {
			value = value.replace(/(\d{2})\D*(\d{5})(\d{4})/, '($1) $2-$3');
		} else {
			value = value.replace(/(\d{2})\D*(\d{4})(\d{4})/, '($1) $2-$3');
		}
	}

	target.value = value;
}, false);

document.getElementById('curriculo-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    try {
        const response = await fetch('generate.php', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok && response.headers.get('content-type').includes('application/pdf')) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'curriculo_' + new Date().toISOString().split('T')[0] + '.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            showNotification('PDF gerado com sucesso!', 'success');
        } else {
            const error = await response.json();
            showNotification(error.erros.join('\n'), 'error');
        }
    } catch (erro) {
        showNotification('Erro: ' + erro.message, 'error');
    }
});

function showNotification(msg, type) {
    const toast = document.getElementById('notificacao');
    const toastBody = document.getElementById('notificacao-msg');
    toastBody.textContent = msg;
    toast.className = `toast show alert-${type === 'success' ? 'success' : 'danger'}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Navegação entre abas
document.addEventListener('DOMContentLoaded', function() {
    // Botões de navegação
    const btnNextToExperience = document.getElementById('btnNextToExperience');
    const btnBackToPersonal = document.getElementById('btnBackToPersonal');
    const btnNextToReferences = document.getElementById('btnNextToReferences');
    const btnBackToExperience = document.getElementById('btnBackToExperience');
    const btnNextToPreview = document.getElementById('btnNextToPreview');
    const btnBackToReferences = document.getElementById('btnBackToReferences');
    const backToFormBtn = document.getElementById('backToFormBtn');

    // Tabs
    const personalTab = new bootstrap.Tab(document.getElementById('personal-tab'));
    const experienceTab = new bootstrap.Tab(document.getElementById('experience-tab'));
    const referencesTab = new bootstrap.Tab(document.getElementById('references-tab'));
    const previewTab = new bootstrap.Tab(document.getElementById('preview-tab'));

    // Navegação: Dados Pessoais -> Experiências
    if (btnNextToExperience) {
        btnNextToExperience.addEventListener('click', function() {
            experienceTab.show();
        });
    }

    // Navegação: Experiências -> Dados Pessoais
    if (btnBackToPersonal) {
        btnBackToPersonal.addEventListener('click', function() {
            personalTab.show();
        });
    }

    // Navegação: Experiências -> Referências
    if (btnNextToReferences) {
        btnNextToReferences.addEventListener('click', function() {
            referencesTab.show();
        });
    }

    // Navegação: Referências -> Experiências
    if (btnBackToExperience) {
        btnBackToExperience.addEventListener('click', function() {
            experienceTab.show();
        });
    }

    // Navegação: Referências -> Preview
    if (btnNextToPreview) {
        btnNextToPreview.addEventListener('click', function() {
            previewTab.show();
        });
    }

    // Navegação: Preview -> Referências
    if (btnBackToReferences) {
        btnBackToReferences.addEventListener('click', function() {
            referencesTab.show();
        });
    }

    // Botão "Voltar ao Formulário" na aba de preview
    if (backToFormBtn) {
        backToFormBtn.addEventListener('click', function() {
            personalTab.show();
        });
    }
});

