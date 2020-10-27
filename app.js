//We have 3 modules in this application
//first one
let budgetController = (function(){
    let Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1
    }
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else{
            this.percentage = -1
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }


    let Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
    function calculateTotal(type){
        let sum = 0
        data.allItems[type].forEach(cur => {
            sum += cur.value;
        });
        data.totals[type] = sum;
    }
    let data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1

    }
    return{
        addItem: function(type, des, val){
            let newItem, ID;
            //create new Item
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else ID = 0;
            //create new item based on 'inc' or 'exp'
            if (type === 'inc'){
                newItem = new Income(ID, des, val)
            }
            else if (type === 'exp'){
                newItem = new Expense(ID, des, val)
            }
            //push the newItem to our chosen array
            data.allItems[type].push(newItem);
            //return the newItem to the methode
            return newItem
        },
        
        deleteITems: function(type, id){
            let ids, index;
            ids = data.allItems[type].map(a => {
                return a.id
            })
            index = ids.indexOf(id);
            if (index !== -1){
                data.allItems[type].splice(index, 1)
            }
   
           },
        calculateBudget: function(){
            //Calculate total income and expenses
            calculateTotal('inc')
            calculateTotal('exp')
            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp

            //calculate the percentage of the income that we spent
            if (data.totals.inc > 0){

                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else{
                data.percentage = -1
            }

        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(cur => {
                cur.calcPercentage(data.totals.inc)
            })
        },

        getPercentages: function(){
            let allPerc = data.allItems.exp.map(cur => {
                return cur.getPercentage()
            })
            return allPerc
        },
        getBudget: function(){
            return{
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }

        },
        testing: function(){
            console.log(data)
        }

    }

})();

//second one
let UIController = (function(){
    let DOMStrings = {
       inputType: '#select',
       inputDescription: '#description',
       inputValue: '#value',
       inputBtn: '#confirm',
       incomesContainer: '.income-list',
       expensesContainer: '.expenses-list',
       budgetLabel: '#display-budget',
       incomeLabel: '.income-label',
       expenseLabel: '.expense-label',
       percentageLabel: '.percentage-label',
       container: '.display-income-expences',
       LabelExpansesPerc: '.item--percentage',
       dateLabel: '.display-date'
    };
    let formatNumber = function(num, type){
        let numSplit, int, dec, sign;

        num = Math.abs(num)
        num = num.toFixed(2)

        numSplit = num.split('.')
        int = numSplit[0]

        if (int.length > 3){
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, 3)
        }
        dec = numSplit[1]

        type === 'exp' ? sign = '-': sign = '+';
        return sign + ' ' + int + '.'+ dec + '$'


    };

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value,// will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem: function(obj, type){
            let html, newHtml, element;
            //create HTML string with placeholder text
            if (type === 'inc'){
                element = DOMStrings.incomesContainer
                html = '<div id="inc--%id%" class="income-item"><div class="description">%description%</div><div class="item--value" style="color:#1abc9c;">%value%</div><div class="item-delete"><button class="item--delete-btn" style="color: #1abc9c; border: 0.2vh solid #1abc9c; background-color: #1abc9c69;">X</button></div></div>'
            }
            else if (type === 'exp'){
                element = DOMStrings.expensesContainer
                html = '<div id="exp--%id%" class="expense-item"> <div class="description">%description%</div><div class="item--value" style="color:#e74c3c; margin-left: 5.5vh;">%value%</div><div class="item--percentage">10%</div><div class="item-delete"><button class="item--delete-btn">X</button></div></div>'
            }
           
            //replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description)
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))
            // newHtml = newHtml.replace('%value%', obj.value)

            //insert the HTML in to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend' ,newHtml)

        },
        deleteListItem: function(selectorID){
            let el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el)    
        },
        clearFields: function(){
            let fields, fieldArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue)
            fieldArray = Array.prototype.slice.call(fields);
            fieldArray.forEach(element => {
                element.value = ""
            })
            fieldArray[0].focus()
        },

        displayBudget: function(obj){
            let type;
            obj.budget > 0 ? type ='inc': type = 'exp'
            if (obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + " %"

            } else{
                document.querySelector(DOMStrings.percentageLabel).textContent = "---"
                document.querySelector(DOMStrings.percentageLabel).classList.add('dash-opa')

            }

           document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget
           document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc
           document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp

        },
        displayPercentages: function(percentages){
           let fields =  document.querySelectorAll(DOMStrings.LabelExpansesPerc);

           let nodeListForEach = function(list, callback){
               for(let i = 0; i < list.length; i++){
                    callback(list[i], i)
               }
           }
           nodeListForEach(fields, (cur, index) => {
               if (percentages[index] > 0){
                cur.textContent = percentages[index] + "%";

               } else{
                   cur.textContent = '---'
               }
           })
        },

        displayDate: function(){
            let now, year, month, months
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
            document.querySelector(DOMStrings.dateLabel).classList.add('date-stylus')
        },

        changeStyle: function(){
            let fields = document.querySelectorAll(
            DOMStrings.inputType + ',' +
            DOMStrings.inputDescription + ',' + 
            DOMStrings.inputValue);
            let nodeListForEach = function(list, callback){
                for(let i = 0; i < list.length; i++){
                     callback(list[i], i)
                }
            }
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-fields')
            })
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red-btn')
            document.querySelector(DOMStrings.inputType).classList.toggle('red-shadow')

        },

      


        getDOMSring: function(){
            return DOMStrings;
        
    }

    }

})();

//third one or the Main Modules who serve as link between the two other modules
let controller = (function(budgetCtr, UIctr){
    let setUpEventListener = function(){
        let DOM = UIctr.getDOMSring();
        const addBtn = document.querySelector(DOM.inputBtn)
        const container = document.querySelector(DOM.container)
        addBtn.addEventListener('click', ctrAddItem)
        document.addEventListener('keypress', (e) => {
         if (e.key === 'Enter' || e.which === 13 || e.keyCode === 13){
            ctrAddItem()
         }
         })
        document.querySelector('form').addEventListener('submit', (e) => {
          e.preventDefault()
        })
        container.addEventListener('click',ctrDeleteItem)

        document.querySelector(DOM.inputType).addEventListener('change', UIctr.changeStyle);
}
function updateBudget(){
    let budget;
//1.Calculate the budget
budgetCtr.calculateBudget();
//2.return the budget
budget = budgetCtr.getBudget();
//3.Display the budget in the UI
UIctr.displayBudget(budget)

}

function updatePercentages(){
    //1. claculate the percentages
    budgetCtr.calculatePercentages();

    //2.read the percentage from the budget controller
    let percs = budgetCtr.getPercentages()
    
    //3.update the UI
    UIctr.displayPercentages(percs)
}

function ctrAddItem(){
    let input, newItem, item;
//when the button is clicked or the Enter key is pressed:
    //1.we want to grab the value in the inputs field
    input = UIctr.getInput();
    
    if (input.description !== "" && !isNaN(input.value) && input.value > 0){
        //2.pass the values the the budgetController
        newItem =  budgetController.addItem(input.type, input.description, input.value)
        //3.Add the items to the UI
        item = UIctr.addListItem(newItem, input.type)
        //4.clear fields
        UIctr.clearFields()
        //5.calculate and update budget
        updateBudget();
        //6.calculate and update the percentages
        updatePercentages()
    }
    

}

function ctrDeleteItem(event){
    let itemID, splitID, type, ID;
    itemID =  event.target.parentNode.parentNode.id
    if (itemID){
        splitID = itemID.split('--')
        type = splitID[0]
        ID = parseInt(splitID[1])
        //1.delete items from our data structure
        budgetCtr.deleteITems(type, ID)
        //2.delete items from UI
        UIctr.deleteListItem(itemID)
        //3.update and show the new budget
        updateBudget()
         //6.calculate and update the percentages
         updatePercentages()


        
    }
   


}
    return{
        init: function(){
            UIctr.displayDate();
            UIctr.displayBudget({
                budget: 0,
                percentage: -1,
                totalInc: 0,
                totalExp: 0
            })
            return setUpEventListener()
        }
    }

})(budgetController, UIController)
controller.init()