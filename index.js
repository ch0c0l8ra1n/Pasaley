// alert("LMAO");

const asleep =  (delay) => {
    return new Promise(resolve => setTimeout(resolve,delay));
}

// const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL = "https://www.shakenep.com";

(async () => {

    while(!document.getElementsByClassName("pdp-product-title")[0]){
        await asleep(100);
    }

    const cat = document.getElementsByClassName("breadcrumb_item")[0].textContent.trim();
    const name = document.getElementsByClassName("pdp-product-title")[0].textContent.trim();

    const priceElem = document.getElementsByClassName("pdp-product-price")[0];

    console.log(priceElem);

    const price = parseInt(
        priceElem.textContent
            .replace("Rs.","")
            .replaceAll(",","")
            .trim()
    );

    const url = new URL(`${BASE_URL}/matches`);
    const params = {
        title: name,
        price:price,
        category:cat,
        pathname: document.location.pathname
    }

    Object.keys(params).forEach(key => url.searchParams.append(key,params[key]));

    console.log("Getting: ",url);

    let result;

    try {
        const resp = await fetch(url);
        result = await resp.json();
    }
    catch(err){
        console.log("Error!");
        console.log(err);
        return;
    }

    console.log("Got!");
    console.log(result);

    const domElem = document.getElementById("module_product_price_1")
    const newContainer = document.createElement("ul");

    const noImageLink = "https://hamrobazaar.obs.ap-southeast-3.myhuaweicloud.com/Assets/NoImage.png";


    for (const item of result){

        let imageLink = item.image ? item.image : noImageLink;
        console.log(item);

        // Get hostname from link and trim www.
        const hostname = new URL(item.link).hostname
                        .replace("www.","");

        const html = `
        <div class="pasaley-container" >
            <a href="${item.link}" target="_blank">
                <div class="product-container" >
                    <div class="product-image" >
                        <img 
                         src="${imageLink}"/>
                    </div>
                    <div class="product-details" >
                        <div class="product-title" > ${item.title} </div>
                        <div class="product-source">
                            <img  src="${BASE_URL}/static/${hostname}.png"/>
                        </div>
                        <div class="product-price"> Price: Rs. ${item.price}</div>
                    </div>
                </div>
            </a>
        </div>
        <div style="display: flex; justify-content: center">
            <hr style="width: 90%"/>
        <div>
        `;


        const tempContainer = document.createElement("li");

        tempContainer.innerHTML = html;

        //
        // const temp = document.createElement("a");
        // temp.setAttribute("target","_blank");
        // temp.setAttribute("href","https://beta.hamrobazaar.com/product/dummy/"+item.id);
        // temp.innerText = item.name + " | " + item.price;
        //
        // tempContainer.appendChild(temp);
        // newContainer.appendChild(tempContainer);

        newContainer.append(tempContainer);
    }

    if (newContainer.children.length > 0){
        newContainer.lastChild.lastChild.remove();
    }

    newContainer.style["border"] = "1px solid black";
    newContainer.style["fontSize"] = "10px";

    domElem.append(newContainer);


})();


// console.log(cat,name);