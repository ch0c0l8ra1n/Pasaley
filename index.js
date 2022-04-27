// alert("LMAO");

const asleep =  (delay) => {
    return new Promise(resolve => setTimeout(resolve,delay));
}

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

    const url = new URL(`https://www.shakenep.com/matches`);
    const params = {
        title: name,
        category: cat,
        price:price
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

        let imageLink = item.imageUrl ? item.imageUrl : noImageLink;

        const html = `
        <div style="padding: 5px;">
            <a href="https://hamrobazaar.com/product/dummy/${item.id}" target="_blank">
                <div style="display: flex;padding: 5px;">
                    <div style="width: 50px">
                        <img style="width:50px;" src="${imageLink}"/>
                    </div>
                    <div style="display: flex; flex-direction: column; padding: 0px 5px">
                        <div style="flex-grow: 1; font-size: 1.5em;">${item.name}</div>
                        <div style="color: #f57224; font-size: 2em;">Rs. ${item.price}</div>
                    </div>
                </div>
            </a>
        </div>
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

    newContainer.style["border"] = "1px solid black";

    domElem.append(newContainer);


})();


// console.log(cat,name);