document.addEventListener('DOMContentLoaded', function () {
  const dob = document.getElementById('dob');
  const ageField = document.getElementById('age');

  if (!dob || !ageField) return;

  const MIN_AGE = parseInt(dob.dataset.minAge, 10) || 16;
  const MAX_AGE = parseInt(dob.dataset.maxAge, 10) || 100;

  function calculateAgeFromValue(val) {
    if (!val) return null;
    const birth = new Date(val + 'T00:00:00'); 
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  function update() {
    const val = dob.value;
    const age = calculateAgeFromValue(val);

    // limpar se inválido / futuro / vazio
    if (age === null || age < 0) {
      ageField.value = '';
      dob.setCustomValidity(age === null ? 'Data inválida' : 'Data no futuro');
      return;
    }

    ageField.value = age;

    if (age < MIN_AGE) {
      dob.setCustomValidity(`Idade mínima: ${MIN_AGE} anos`);
    } else if (age > MAX_AGE) {
      dob.setCustomValidity('Verifique a data de nascimento');
    } else {
      dob.setCustomValidity('');
    }
  }

  dob.addEventListener('change', update);
  dob.addEventListener('input', update);

  update();
});
