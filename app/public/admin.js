/*
  Script cliente para el login de administrador.
  Requiere un formulario con:
    - input#email
    - input#password
    - button[type="submit"]
    - div#error (opcional, se crea si no existe)
*/

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

    if (!form || !emailInput || !passwordInput) {
        console.warn('Formulario de login o campos #email/#password no encontrados.');
        return;
    }

    let errorBox = document.querySelector('#error');
    if (!errorBox) {
        errorBox = document.createElement('div');
        errorBox.id = 'error';
        errorBox.style.color = 'red';
        errorBox.style.marginTop = '0.5rem';
        form.appendChild(errorBox);
    }

    const setError = (msg) => {
        errorBox.textContent = msg || '';
    };

    const validate = () => {
        const email = emailInput.value.trim();
        const pwd = passwordInput.value;
        if (!email) return 'Ingrese su correo electrónico.';
        // validación simple de email
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) return 'Correo electrónico inválido.';
        if (!pwd) return 'Ingrese su contraseña.';
        if (pwd.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
        return null;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setError('');
        const clientError = validate();
        if (clientError) {
            setError(clientError);
            return;
        }

        const payload = {
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        // Deshabilitar inputs mientras se procesa
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            const res = await fetch('/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'same-origin'
            });

            if (res.ok) {
                // Si el servidor devuelve JSON con destino, usarlo; si no, redirigir a /admin
                try {
                    const data = await res.json();
                    const redirectTo = data && data.redirect ? data.redirect : '/admin';
                    window.location.href = redirectTo;
                } catch {
                    window.location.href = '/admin';
                }
                return;
            }

            if (res.status === 401 || res.status === 400) {
                // Mensaje concreto para credenciales inválidas
                const text = await res.text();
                setError(text || 'Credenciales inválidas.');
            } else {
                const text = await res.text();
                setError(text || 'Error en el servidor. Intente nuevamente.');
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setError('No se pudo conectar con el servidor.');
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
});