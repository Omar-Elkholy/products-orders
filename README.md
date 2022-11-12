# EG-SHOP
Angular 14 app to show products, make orders &amp; show order details.

##Tools

- Angular Material
- Bootstrap 5
- SCSS
- Ngx Toastr


## Performance Tip
- In the order details component, We need to get the object of every product inside order which causes o(n^2) time complexity.


## Solution
- Getting all product & converting products array to an object with the key of the productId & value of the product object -> so now, we get the product by id with time complexity o(n).
