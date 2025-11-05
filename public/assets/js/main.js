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
