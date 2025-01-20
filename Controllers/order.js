import { orderModel } from "../Models/order.js"

export const getAllorders = async (req, res) => {

    try {
        let data = await orderModel.find();
        res.json(data);
    }
    catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get all", message: "something worng" });
    }

}

export const addOrder = async (req, res) => {
    if (!req.body.address || !req.body.custId || !req.body.products)//שדות חובה
        return res.status(404).json({ title: "missing custId or address or products", message: "missing data" });

    if (req.body.address.length < 2 || req.body.custId <= 0)//בדיקות תקינות
        return res.status(404).json({ title: "wornge customer name or address", message: "missing data" });
    
    let prod = req.body.products;
    const isValidProducts = prod.every(//בדיקות תקינות  על כל מוצר
        (product) =>
            product.prodName &&
            product.prodPrice > 0 &&
            product.cnt > 0
    );
    
    if (!isValidProducts) {
        return res.status(400).json({
            title: "Invalid product data",
            message: "Each product must have 'prodName', 'prodPrice' > 0, and 'cnt' > 0",
        });
    }

    try {
        let newOrder = new orderModel(req.body);

        newOrder.orderDate = new Date();//אתחול הזמנה
        let date = new Date();
        // הוספת 30 יום
        date.setDate(date.getDate() + 30);//דד ליין קבוע של 30 יום
        newOrder.Deadline = date;
        newOrder.isGoToTheWay = false;
        newOrder.orderPrice = 50;//מחיר קבוע למשלוח

        newOrder.finalPrice = newOrder.orderPrice + newOrder.products.reduce((total, product) => {//חישוב מחיר סופי סכימת כל המוצרים כפול הכמות שלהם
            return total + (product.prodPrice * product.cnt);
        }, 0);

        let data = await newOrder.save();
        res.json(data);

    } catch (err) {
        console.log("err " +err.message);
        res.status(400).json({ title: "error canot add order", message: "something worng" });
    }

}

export const deleteOrder = async (req, res) => {
    let { id } = req.params;

    try {
        let order = await orderModel.findById(id);
        if (!order)
            return res.status(404).json({ title: "error canot delete order by id", message: "not parameter from this id" });
        if (order.isGoToTheWay == true)
            return res.status(404).json({ title: "canot delete order", message: "the order go a way" });

        let data = await orderModel.findByIdAndDelete(id);
        res.json(data);
    }
    catch (err) {
        console.log("err");
        res.status(400).json({ title: "error canot delete by id", message: "something worng" });
    }
}

export const getOrdersByCustomer = async (req, res) => {
    try {
        let { id } = req.params;

        if (!id) {
            return res.status(400).json({
                title: "Request error",
                message: "Customer ID required"
            });
        }

        const data = await orderModel.find({ custId: id })

        if (!data) {
            return res.status(404).json({
                title: "No orders found",
                message: "No orders found for this customer"
            });
        }

        res.json(data);

    } catch (err) {
        res.status(500).json({
            title: "System error",
            message: "An error occurred while retrieving orders"
        });
    }
};


export const updateStatus = async (req, res) => {
    let { id } = req.params;
    try {
        let data = await orderModel.findById(id);
        if (!data)
            return res.status(404).json({ title: "order not definde", message: "not parameter from this id" });
        data.isGoToTheWay = true;//עדכון הזמנה שיצאה לדרך
        await data.save();

        res.json(data);
    }
    catch(err) {
        console.log(err.message)
        res.status(500).json({
            title: "שגיאת מערכת",
            message: "אירעה שגיאה בעת עדכון ההזמנה"
        });
    }
}
