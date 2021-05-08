
const Modal = {
    open() {
        //abrir modal
        //adicionar class active ao modal
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        //fechar modal
        //remover class active do modal
        document.querySelector('.modal-overlay').classList.remove('active')

    }

}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finance:transactions")) || []
    },
    set(transactions) { 
        localStorage.setItem("dev.finance:transactions", JSON.stringify(transactions))
        
    }
}


const Transaction = {
    all: Storage.get(),

    add(transacation) {
        Transaction.all.push(transacation)
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()

    },
    incomes() {
        let income = 0;
        Transaction.all.forEach((transacation) => {
            if (transacation.amount > 0) {
                income += transacation.amount;
            }
        })
        return income
    },
    expenses() {
        let expense = 0;
        Transaction.all.forEach((transacation) => {
            if (transacation.amount < 0) {
                expense += transacation.amount;
            }
        })
        return expense
    },
    total() {

        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody')
    ,
    addTransaction(transacation, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transacation, index);
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)

    },
    innerHTMLTransaction(transacation, index) {
        const CSSclass = transacation.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transacation.amount)
        const html = `                   
        <td class="description">${transacation.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transacation.date}</td>
        <td>
        <img onclick="Transaction.remove(${index})" src="/assets/minus.svg" alt="Remover transaçao">
        </td>
        `
        return html

    },

    updateBalance() {
        document.
            getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.
            getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.
            getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}


const Utils = {

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    },
    formatAmount(value) {
        value = Number(value) * 100
        return Math.round(value)
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateField() {
        const { description, amount, date } = Form.getValues()
        if (description.trim() === ""
            || amount.trim() === ""
            || date.trim() === "") {
            Form.clearFields()
            throw new Error("Por favor, preencha corretamente todos os campos")

        }

    },

    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)
        return {
            description, amount, date
        }

    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()
        try {
            // verificar todas info estão ok
            Form.validateField()
            // formatar dados para salvar
            const transaction = Form.formatValues()
            //salvar
            Form.saveTransaction(transaction)
            //apagar dados do form
            Form.clearFields();
            // modal fecha
            Modal.close()
            //Atualizar aplicacao

        } catch (error) {
            alert(error.message)
        }

    }
}


const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()




//let modalOverlay = document.querySelector('.modal-overlayspan');
//let classes = modalOverlay.classList;

//span.addEventListener('click', function () {
 //   let result = classes.toggle('active');

  //  if (result) {
  //      span.textContent = `'active' added; classList is now "${classes}".`;
  //  } else {
//span.textContent = `'active' removed; classList is now "${classes}".`;
  //  }
//})