import express from "express"
import { createService, get_service_user_According, getSingleService, perticular_sub_cat_service, search_service_by_title, service_category_according } from "../../controllers/Service-C/service-controller.js"
import { upload } from "../../common/image.js"

const serviceRouter = express.Router()

serviceRouter.post("/create-service",upload.array("servicePoster", 3), createService)

serviceRouter.get("/single-service/:serviceId", getSingleService)

serviceRouter.get("/subcategory-service/:sub_categoryId", perticular_sub_cat_service)

serviceRouter.get("/services-category/:categoryId", service_category_according)

serviceRouter.post("/searchService", search_service_by_title)

serviceRouter.get("/auth-service/:authId", get_service_user_According)

export default serviceRouter