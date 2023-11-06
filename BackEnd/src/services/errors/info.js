export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name : need to be a String, recived ${user.first_name}
    * last_name : need to be a String, recived ${user.last_name}
    * email : need to be a String, recived ${user.email}
    * age : need to be a Number, recived ${user.age}`
}

export const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title : need to be a String, recived ${product.title}
    * description : need to be a String, recived ${product.description}
    * category : need to be a String, recived ${product.category}
    * code : need to be a String, recived ${product.code}
    * price : need to be a Number, recived ${product.price}
    * stock : need to be a Number, recived ${product.stock}`
}

export const generateProductIntoCartErrorInfo = (cid, pid, quantity) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * cid : need to be a String, recived ${cid}
    * pid: need to be a String, recived ${pid}
    * quantity : need to be a Number, recived ${quantity}`
}