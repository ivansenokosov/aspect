export function priceFormat<String>(price: String) {
    return Number(price).toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}