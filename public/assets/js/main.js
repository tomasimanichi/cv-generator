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

// Máscara simples para telefone brasileiro (formatação ao digitar)
document.addEventListener('DOMContentLoaded', function() {
	var phoneInputs = document.querySelectorAll('input[type="tel"]');
	phoneInputs.forEach(function(input) {
		input.addEventListener('input', function(e) {
			var value = e.target.value.replace(/\D/g, '');

			// Formatar DDD + número (suporta 8 ou 9 dígitos locais)
			if (value.length > 2) {
				value = value.replace(/^([0-9]{2})([0-9]+)$/, '($1) $2');
				// Separador de sufixo (4 ou 5 dígitos)
				if (value.replace(/\D/g, '').length > 10) {
					// formato (DD) 9XXXX-XXXX
					value = value.replace(/(\d{2})\D*(\d{5})(\d{4})/, '($1) $2-$3');
				} else {
					// formato (DD) XXXX-XXXX
					value = value.replace(/(\d{2})\D*(\d{4})(\d{4})/, '($1) $2-$3');
				}
			}
			e.target.value = value;
		});
	});
});
