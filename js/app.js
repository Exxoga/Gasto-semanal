/* Variables */
const formulario = document.querySelector('#agregar-gasto');
const listaGastos = document.querySelector('#gastos ul');


/* Event Listeners */
document.addEventListener('DOMContentLoaded', preguntarUsuario);
formulario.addEventListener('submit', agregarGasto);


/* Clases */
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto)
    this.gastos = [];
  };

  agregarNuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  };

  calcularRestante() {
    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    this.restante = this.presupuesto - gastado;
  };

  borrarGasto(id) {
    this.gastos = this.gastos.filter(gasto => gasto.id !== id);
    this.calcularRestante();
  };
}

class UI {

  mostrarPresupuesto(dinero) {
    const { presupuesto, restante } = dinero;
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {

    const divAlerta = document.createElement('div');
    divAlerta.classList.add('alert', 'text-center');
    divAlerta.textContent = mensaje;

    if (tipo === 'error') {
      divAlerta.classList.add('alert-danger');
    } else {
      divAlerta.classList.add('alert-success');
    }

    document.querySelector('.primario').insertBefore(divAlerta, formulario);
    setTimeout(() => {
      divAlerta.remove();
    }, 1500);
  }

  mostrarGastos(gastos) {

    this.limpiarHTML();

    gastos.forEach(gasto => {
      const { nombre, cantidad, id } = gasto;

      const gastoHTML = document.createElement('li');
      gastoHTML.className = 'list-group-item d-flex justify-content-between align-items-center';
      gastoHTML.dataset.id = id;
      gastoHTML.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.innerHTML = `Borrar &times`;
      btnBorrar.onclick = () => {
        borrarGasto(id);
      }
      gastoHTML.appendChild(btnBorrar);
      listaGastos.appendChild(gastoHTML);
    })
  }

  limpiarHTML() {
    while (listaGastos.firstChild) {
      listaGastos.removeChild(listaGastos.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector('#restante').textContent = restante;
  }

  comprobarRestante(presupuestObj) {

    const { presupuesto, restante } = presupuestObj;

    const color = document.querySelector('.restante');

    if ((presupuesto / 4) > restante) {
      color.classList.add('alert-danger');
      color.classList.remove('alert-warning', 'alert-success');
    } else if ((presupuesto / 2) > restante) {
      color.classList.add('alert-warning');
      color.classList.remove('alert-danger', 'alert-success');
    } else {
      color.classList.remove('alert-danger', 'alert-warning');
      color.classList.add('alert-success');
    }

    if (restante <= 0) {
      ui.imprimirAlerta('Se ha agotado el presupuesto', 'error');
      document.querySelector('button[type="submit"]').disabled = true;
    } else {
      document.querySelector('button[type="submit"]').disabled = false;
    }
  }
}


const ui = new UI();
let presupuesto;
/* Funciones */

function preguntarUsuario() {

  const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

  if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();
    return;
  }

  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.mostrarPresupuesto(presupuesto);
}

function agregarGasto(e) {
  e.preventDefault();

  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  if (nombre === '' || cantidad === '') {
    ui.imprimirAlerta('Todos los campos son requeridos', 'error');
    return;
  } else if (isNaN(cantidad) || cantidad <= 0) {
    ui.imprimirAlerta('Valor en gasto no valido', 'error');
    return;
  }

  ui.imprimirAlerta('Gasto agregado correctamente');
  formulario.reset();
  const gastoNuevo = { nombre, cantidad, id: Date.now() };
  presupuesto.agregarNuevoGasto(gastoNuevo);
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarRestante(presupuesto);
}

function borrarGasto(id) {
  presupuesto.borrarGasto(id);
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarRestante(presupuesto);
}