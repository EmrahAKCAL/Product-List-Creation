//Storage Controller
const StorageController=(function(){
    return {
        storageProduct: function(product){
            let products;
            if(localStorage.getItem('products')==null){
                products=[];
                products.push(product);
            }
            else{
                products= JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products', JSON.stringify(products));
        },
        getProducts: function(){
            let products;
            if(localStorage.getItem('products')==null){
                products=[];
            }
            else{
                products= JSON.parse(localStorage.getItem('products'));
            }
            return products;
        },
        updateProduct: function(product){
            let products= JSON.parse(localStorage.getItem('products'));
            products.forEach(function(prd, index){
                if(product.id==prd.id){
                    products.splice(index, 1, product);
                }
            });
            localStorage.setItem('products', JSON.stringify(products));
        },
        deleteProduct: function(id){
            let products= JSON.parse(localStorage.getItem('products'));
            products.forEach(function(prd, index){
                if(id==prd.id){
                    products.splice(index, 1);
                }
            });
            localStorage.setItem('products', JSON.stringify(products));
        }
    }
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
        Products: StorageController.getProducts(),
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
        updateProduct: function(name, price, priceTL){
            let product=null;
            data.Products.forEach(function(prd){
                if(prd.id==data.selectedProduct.id){
                    prd.name=name;
                    prd.price=parseFloat(price);
                    prd.priceTL=parseFloat(priceTL);
                    product=prd;
                }
            });

            return product;
        },
        deleteProduct: function(product){
            data.Products.forEach(function(prd, index){
                if(prd.id==product.id){
                    data.Products.splice(index, 1);
                }
            });
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
        productListItems: '#item-list tr',
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
        updateProduct: function(prd){
            let updataItem=null;
            let items= document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item){
                if(item.classList.contains(Selectors.bgWarning)){
                    item.children[1].textContent= prd.name;
                    item.children[2].textContent=prd.price + '$';
                    item.children[3].textContent=prd.priceTL+ ' TL';
                    //...........................................................
                    updataItem=item;
                }
            });
            return updataItem;
        },
        clearInputs: function(){
            document.querySelector(Selectors.productName).value='';
            document.querySelector(Selectors.productPrice).value='';
            document.querySelector(Selectors.productTL).value='';
        },
        clearWarnings: function(){
            const items=document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item){
                if(item.classList.contains(Selectors.bgWarning)){
                    item.classList.remove(Selectors.bgWarning);
                }
            });
        },
        hideCard: function(){
            document.querySelector(Selectors.productCard).style.display='none';
        },
        showTotal: function(total){
            document.querySelector(Selectors.totalDolar).textContent=total.toFixed(2);
        },
        showTotalTL: function(totalTL){
            document.querySelector(Selectors.totalTL).textContent=totalTL.toFixed(2);
        },
        addProductToForm: function(){
            const selectedProduct= ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value= selectedProduct.name;
            document.querySelector(Selectors.productPrice).value= selectedProduct.price;
            document.querySelector(Selectors.productTL).value= selectedProduct.priceTL/selectedProduct.price;
        },
        deleteProduct: function(){
            let items= document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item){
                if(item.classList.contains(Selectors.bgWarning)){
                    item.remove();
                }
            });
        },
        addingState: function(item){
            UIController.clearWarnings();

            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display='inline';
            document.querySelector(Selectors.updateButton).style.display='none';
            document.querySelector(Selectors.deleteButton).style.display='none';
            document.querySelector(Selectors.cancelButton).style.display='none';
        },
        editState: function(tr){
            tr.classList.add(Selectors.bgWarning);
            document.querySelector(Selectors.addButton).style.display='none';
            document.querySelector(Selectors.updateButton).style.display='inline';
            document.querySelector(Selectors.deleteButton).style.display='inline';
            document.querySelector(Selectors.cancelButton).style.display='inline';
        }
    }
})();

//App Controller
const App=(function(ProductCtrl, UICtrl, StorageCtrl){
    const UISelectors= UICtrl.getSelectors();
    //Load Event Listeners
    const loadEventListeners= function(){
        //add product event submit
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        //edit product click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

        //edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);

        //cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpDate);

        //delete product
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);

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

            //add product to local storage
            StorageCtrl.storageProduct(newProduct);

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

    const productEditClick=function(event){
        if(event.target.classList.contains('btn-sChangesTable')){
            const id= event.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;


            //get selected product
            const product= ProductCtrl.getProductById(id);
            //set current product
            ProductCtrl.setCurrentProduct(product);
            UICtrl.clearWarnings();
            //add product to UI
            UICtrl.addProductToForm();
            UICtrl.editState(event.target.parentNode.parentNode);
        }

        event.preventDefault();
    }

    const  editProductSubmit=function(event){
        const productName=document.querySelector(UISelectors.productName).value;
        const productPrice=document.querySelector(UISelectors.productPrice).value;
        const productTL=document.querySelector(UISelectors.productTL).value;

        if(productName!=='' && productPrice!=='' && productTL!==''){
            const priceTL=(productPrice*productTL).toFixed(2); 
            //update product
            const updateProduct= ProductCtrl.updateProduct(productName, productPrice, priceTL);

            //uptade ui
            let item= UICtrl.updateProduct(updateProduct);

            const total= ProductCtrl.getTotal();
            //show total
            UICtrl.showTotal(total);

            const totalTL= ProductCtrl.getTotalTL();
            //show total
            UICtrl.showTotalTL(totalTL);

            //update storage
            StorageCtrl.updateProduct(updateProduct);

            UICtrl.addingState();
        }

        event.preventDefault();
    }

    const cancelUpDate=function(event){

        UICtrl.addingState();
        UICtrl.clearWarnings();
        event.preventDefault();
    }
    
    const deleteProductSubmit= function(event){
        //get selected product
        const selectedProduct=ProductCtrl.getCurrentProduct();
        //delete product
        ProductCtrl.deleteProduct(selectedProduct);

        //delete ui
        UICtrl.deleteProduct();

        //show total
        const total= ProductCtrl.getTotal();
        UICtrl.showTotal(total);

        //show total
        const totalTL= ProductCtrl.getTotalTL();
        UICtrl.showTotalTL(totalTL);


        if(total==0){
            UICtrl.hideCard();
        }
       //delete from storage
       StorageCtrl.deleteProduct(selectedProduct.id);

        UICtrl.addingState();
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
            const total= ProductCtrl.getTotal();
            //show total
            UICtrl.showTotal(total);
    
            const totalTL= ProductCtrl.getTotalTL();
            //show total
            
            UICtrl.showTotalTL(totalTL);
            //load event listeners
            loadEventListeners();
        }
    }
})(ProductController, UIController, StorageController);

App.init();