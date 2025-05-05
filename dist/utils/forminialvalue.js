"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmptyInitialValues = void 0;
const getEmptyInitialValues = () => ({
    segmentValues: [
        {
            t_class: "",
            air_code: "",
            air_no: "",
            origin: "",
            destination: "",
            flt_date: new Date(),
            arr_date: new Date(),
            dep_time: "10:10",
            arr_time: "10:10",
            seat_b: "",
        },
    ],
    fareValues: [
        {
            pax_type: "ADULT",
            title: "MR",
            first_name: "",
            last_name: "",
            ticket_no: "",
            currency: "PKR",
            other_income: 0,
            other_income_type: "NET",
            curr_label: "PKR : RUPEES",
            roe: 1 || "",
            b_fare: "",
            eq_b_fare: "",
            ttl_agent_per_pass: "",
            ttl_supp_per_pass: "",
            ttl_supp_per_pass_s_curr: "",
            ttl_agg_per_pass_assg_curr: "",
            ttl_agt_pay_d_cur: "",
            ttl_sup_pay_d_cur: "",
            text_cur: [{ tax_yq: "", tax_amount: "" }],
            text_pkr: [{ tax_pkr_yq: "", tax_pkr_amount: "" }],
            tax_pkr: {
                s_psf: "", s_psf_per: "", s_gst: "", s_gst_per: "",
                s_sp: "", s_sp_per: "", s_wht: "", s_wht_per: "",
                c_psf: "", c_psf_per: "", c_gst: "", c_gst_per: "",
                c_sp: "", c_sp_per: "", c_wht: "", c_wht_per: "",
            },
            tax_cur: {
                s_psf: "", s_psf_per: "", s_gst: "", s_gst_per: "",
                s_sp: "", s_sp_per: "", s_wht: "", s_wht_per: "",
                c_psf: "", c_psf_per: "", c_gst: "", c_gst_per: "",
                c_sp: "", c_sp_per: "", c_wht: "", c_wht_per: "",
            },
        },
    ],
    ttl_agent_fare_pkr: 0,
    ttl_supplier_fare_pkr: 0,
    flight_id: null,
    description: "",
});
exports.getEmptyInitialValues = getEmptyInitialValues;
