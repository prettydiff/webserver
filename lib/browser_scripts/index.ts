(function index():void {
    let index:number = 0,
        count:number = 0;
    const tr:HTMLCollectionOf<HTMLElement> = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr"),
        total:number = tr.length;
    do {
        if (tr[index].getElementsByTagName("th").length > 0) {
            count = 0;
        } else {
            tr[index].setAttribute("class", (count % 2 === 0)
                ? "even"
                : "odd");
            count = count + 1;
        }
        index = index + 1;
    } while (index < total);
}());