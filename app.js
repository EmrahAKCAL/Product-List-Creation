//Storage Controller
const StorageController=(function(){
    
})();

//Product Controller
const ProductController= (function(){

    //private
    const Product= function(id, name, price, priceTL){
        this.id=id;
        this.name=name;
        this.price=price;
        this.priceTL=priceTL;
    }
    const data={
        Products:[],
        selectedProduct: null,
        totalPrice: 0,
        totalPriceTL: 0
    }
    //public
    return{
        getProducts: function(){
            return data.Products;
        },
        getData: function(){
            return data;
        },
        getProductById: function(id){
            let product=null;
            data.Products.forEach(function(prd){
                if(prd.id==id){
                    product=prd
                }
            });
            return product;
        },
        setCurrentProduct: function(product){
            data.selectedProduct = product;
        },
        getCurrentProduct: function(){
            return data.selectedProduct;
        },

        addProduct: function(name, price, priceTL){
            let id;
            if(data.Products.length>0){
                id=data.Products[data.Products.length-1].id+1;

            }else{
                id=1;
            }
            const newProduct= new Product(id, name, parseFloat(price), parseFloat(priceTL));
            data.Products.push(newProduct);
            return newProduct;
        },
        getTotal: function(){
            let total=0;
            data.Products.forEach(function (item){
                total+=item.price;
            });
            data.totalPrice=total;
            return data.totalPrice;
        },
        getTotalTL: function(){
            let totalTL=0;
            data.Products.forEach(function (item){
                totalTL+=item.priceTL;
            });
            data.totalPriceTL=totalTL;
            return data.totalPriceTL;
        }
    }
})();

//UI Controller
const UIController=(function(){
    const Selectors={
        productList: '#item-list',
        addButton: '.btn-add',
        updateButton: '.btn-saveChanges',
        deleteButton: '.btn-delete',
        cancelButton: '.btn-cancel',
        productName: '#productName',
        productPrice: '#productPrice',
        productTL:'#productTL',
        productCard: '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar',
        bgWarning: 'bg-warning'
    }
    return{
        createProductList: function(products){
            let html='';
            products.forEach(prd=>{
                html+=`
                    <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price} $</td>
                        <td>${prd.priceTL} TL</td>
                        <td><i class="far fa-edit btn-sChangesTable"></i></td>
                    </tr>`;

            });
            document.querySelector(Selectors.productList).innerHTML=html;
        },
        getSelectors: function(){
            return Selectors;
        },
        addProduct: function(prd){
            document.querySelector(Selectors.productCard).style.display='block';
            var item=`
                    <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price} $</td>
                        <td>${prd.priceTL} TL</td>
                        <td><i class="far fa-edit btn-sChangesTable"></i></td>
                    </tr>`;
                    document.querySelector(Selectors.productList).innerHTML+=item;
        },
        clearInputs: function(){
            document.querySelector(Selectors.productName).value='';
            document.querySelector(Selectors.productPrice).value='';
            document.querySelector(Selectors.productTL).value='';
        },
        hideCard: function(){
            document.querySelector(Selectors.productCard).style.display='none';
        },
        showTotal: function(total){
            document.querySelector(Selectors.totalDolar).textContent=total;
            //document.querySelector(Selectors.totalTL).textContent=total*4.5;
        },
        showTotalTL: function(totalTL){
            //document.querySelector(Selectors.totalDolar).textContent=total;
            document.querySelector(Selectors.totalTL).textContent=totalTL;
        },
        addProductToForm: function(){
            const selectedProduct= ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value= selectedProduct.name;
            document.querySelector(Selectors.productPrice).value= selectedProduct.price;
            document.querySelector(Selectors.productTL).value= selectedProduct.priceTL/selectedProduct.price;
        },
        addingState: function(){
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display='inline';
            document.querySelector(Selectors.updateButton).style.display='none';
            document.querySelector(Selectors.deleteButton).style.display='none';
            document.querySelector(Selectors.cancelButton).style.display='none';
        },
        editState: function(tr){
            const parent= tr.parentNode;
            for(let i=0; i<parent.children.length; i++){
                parent.children[i].classList.remove(Selectors.bgWarning);
            }
            tr.classList.add(Selectors.bgWarning);
            document.querySelector(Selectors.addButton).style.display='none';
            document.querySelector(Selectors.updateButton).style.display='inline';
            document.querySelector(Selectors.deleteButton).style.display='inline';
            document.querySelector(Selectors.cancelButton).style.display='inline';
        }
    }
})();

//App Controller
const App=(function(ProductCtrl, UICtrl){
    const UISelectors= UICtrl.getSelectors();

    //Load Event Listeners
    const loadEventListener= function(){
        //add product event
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        //edit product
        document.querySelector(UISelectors.productList).addEventListener('click', productEditSubmit);
    }



    const productAddSubmit=function(event){
        const productName=document.querySelector(UISelectors.productName).value;
        const productPrice=document.querySelector(UISelectors.productPrice).value;
        const productTL=document.querySelector(UISelectors.productTL).value;

        if(productName!=='' && productPrice!=='' && productTL!==''){
            //add product
            const priceTL=(productPrice*productTL).toFixed(2);
            const newProduct= ProductCtrl.addProduct(productName, productPrice, priceTL);
            //add item to list
            UICtrl.addProduct(newProduct);

            //get total
            const total= ProductCtrl.getTotal();
            //show total
            UICtrl.showTotal(total);

            const totalTL= ProductCtrl.getTotalTL();
            //show total
            UICtrl.showTotalTL(totalTL);
            //clear inputs
            UICtrl.clearInputs();
        }
        event.preventDefault();
    }

    const productEditSubmit=function(event){
        if(event.target.classList.contains('btn-sChangesTable')){
            const id= event.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;


            //get selected product
            const product= ProductCtrl.getProductById(id);
            //set current product
            ProductCtrl.setCurrentProduct(product);

            //add product to UI
            UICtrl.addProductToForm();
            UICtrl.editState(event.target.parentNode.parentNode);
        }

        event.preventDefault();
    }

    return {
        init: function(){
            UICtrl.addingState();
            const products= ProductCtrl.getProducts();
            if(products.length==0){
                UICtrl.hideCard();
            }
            else{
                UICtrl.createProductList(products);
            }
            //load event listeners
            loadEventListener();
        }
    }
})(ProductController, UIController);

App.init();