import { z } from "zod";

const statusSchema=z.object({
    status:z.number()
})

export default statusSchema;