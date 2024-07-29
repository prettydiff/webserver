(function fileList():void {
    const th:HTMLCollectionOf<HTMLTableCellElement> = document.getElementsByTagName("th"),
        records:HTMLCollectionOf<HTMLTableRowElement> = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr"),
        recordLength:number = records.length,
        recordList:Element[] = [],
        sortEvent = function fileList_sortEvent(event:MouseEvent):void {
            const target:HTMLElement = event.target as HTMLElement,
                parent:HTMLElement = target.parentNode as HTMLElement,
                grandParent:HTMLElement = parent.parentNode as HTMLElement,
                tbodyOld:HTMLElement = document.getElementsByTagName("tbody")[0],
                tbodyNew:HTMLElement = document.createElement("tbody"),
                table:HTMLElement = tbodyOld.parentNode as HTMLElement,
                parentList:HTMLCollectionOf<Element> = grandParent.getElementsByTagName(parent.nodeName),
                direction:"down"|"up" = (target.getAttribute("data-direction") === null)
                    ? "down"
                    : target.getAttribute("data-direction") as "down"|"up",
                getText = function fileList_sortEvent_getText(record:Element):string {
                    if (column === 0) {
                        return record.getElementsByTagName("a")[0].firstChild.textContent;
                    }
                    if (column === 1) {
                        return record.getElementsByTagName("td")[1].firstChild.textContent;
                    }
                    return record.getElementsByTagName("td")[2].getAttribute("data-time");
                };
            let count:number = parentList.length,
                column:number = 0;
            if (direction === "down") {
                target.setAttribute("data-direction", "up");
            } else {
                target.setAttribute("data-direction", "down");
            }
            do {
                count = count - 1;
                if (parentList[count] === parent) {
                    column = count;
                    break;
                }
            } while (count > 0);

            recordList.sort(function fileList_sortEvent_sort(a:Element, b:Element):-1|1 {
                const valueA:string = getText(a),
                    valueB:string = getText(b);
                if (valueA < valueB) {
                    if (direction === "down") {
                        return -1;
                    }
                    return 1;
                }
                if (direction === "down") {
                    return 1;
                }
                return -1;
            });

            count = 0;
            do {
                if (count % 2 < 1) {
                    recordList[count].setAttribute("class", "even");
                } else {
                    recordList[count].setAttribute("class", "odd");
                }
                tbodyNew.appendChild(recordList[count]);
                count = count + 1;
            } while (count < recordLength);
            table.removeChild(tbodyOld);
            table.appendChild(tbodyNew);

        };
    let counter:number = th.length;
    do {
        counter = counter - 1;
        th[counter].getElementsByTagName("button")[0].onclick = sortEvent;
    } while (counter > 0);

    counter = 0;
    do {
        recordList.push(records[counter]);
        counter = counter + 1;
    } while (counter < recordLength);
}());