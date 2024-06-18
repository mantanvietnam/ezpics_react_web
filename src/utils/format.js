export function formatCurrency(amount, currencySymbol) {
    // Chuyển đổi chuỗi số thành số nguyên
    amount = parseInt(amount);

    // Kiểm tra xem amount có phải là một số hợp lệ không
    if (isNaN(amount)) {
        return "Số không hợp lệ";
    }

    // Thêm dấu phẩy phân tách hàng nghìn
    var formattedAmount = amount.toLocaleString('en-US');

    // Thêm ký hiệu tiền tệ nếu được cung cấp
    if (currencySymbol) {
        formattedAmount = formattedAmount + ' ' + currencySymbol;
    }

    return formattedAmount;
}
export const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
};