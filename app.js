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
        productName: '#productName',
        productPrice: '#productPrice',
        productTL:'#productTL',
        productCard: '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'
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
                        <td><button class="btn-sChangesTable"  type="submit"><i class="far fa-edit"></i></button></td>
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
                        <td><button class="btn-sChangesTable"  type="submit"><i class="far fa-edit"></i></button></td>
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
        }
    }
})();

//App Controller
const App=(function(ProductCtrl, UICtrl){
    const UISelectors= UIController.getSelectors();

    //Load Event Listeners
    const loadEventListener= function(){
        //add product event
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);
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
            UIController.addProduct(newProduct);

            //get total
            const total= ProductCtrl.getTotal();
            //show total
            UICtrl.showTotal(total);

            const totalTL= ProductCtrl.getTotalTL();
            //show total
            UICtrl.showTotalTL(totalTL);
            //clear inputs
            UIController.clearInputs();
        }
        event.preventDefault();
    }
    return {
        init: function(){
            console.log('starting app...');
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