

const file_list = function fileList():void {
    const th:HTMLCollectionOf<HTMLTableCellElement> = document.getElementsByTagName("th"),
        records:HTMLCollectionOf<HTMLTableRowElement> = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr"),
        recordLength:number = records.length,
        recordList:Element[] = [],
        sortEvent = function fileList_sortEvent(event:MouseEvent):void {
            const target:HTMLElement = event.target,
                parent:HTMLElement = target.parentNode,
                grandParent:HTMLElement = parent.parentNode,
                tbodyOld:HTMLElement = document.getElementsByTagName("tbody")[0],
                tbodyNew:HTMLElement = document.createElement("tbody"),
                table:HTMLElement = tbodyOld.parentNode,
                parentList:HTMLCollectionOf<Element> = grandParent.getElementsByTagName(parent.nodeName),
                direction:-1|1 = Number(target.dataset.dir) as -1|1,
                getText = function fileList_sortEvent_getText(record:Element):number|string {
                    if (column === 0) {
                        return record.getElementsByTagName("a")[0].firstChild.textContent;
                    }
                    if (column === 1) {
                        return record.getElementsByTagName("td")[1].firstChild.textContent;
                    }
                    if (column === 2) {
                        return Number(record.getElementsByTagName("td")[2].getAttribute("data-raw"));
                    }
                    if (column === 3) {
                        return Number(record.getElementsByTagName("td")[3].getAttribute("data-raw"));
                    }
                    if (column === 4) {
                        return Number(record.getElementsByTagName("td")[3].getAttribute("data-raw"));
                    }
                    if (column === 5) {
                        return Number(record.getElementsByTagName("td")[5].getAttribute("data-raw"));
                    }
                };
            let count:number = parentList.length,
                column:number = 0;
            if (direction === -1) {
                target.setAttribute("data-dir", "1");
            } else {
                target.setAttribute("data-dir", "-1");
            }
            do {
                count = count - 1;
                if (parentList[count] === parent) {
                    column = count;
                    break;
                }
            } while (count > 0);

            recordList.sort(function fileList_sortEvent_sort(a:Element, b:Element):-1|0|1 {
                const valueA:number|string = getText(a),
                    valueB:number|string = getText(b);
                if (valueA < valueB) {
                    return direction;
                }
                if (valueA > valueB) {
                    return (direction * -1 as -1);
                }
                return 0;
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
    document.getElementsByTagName("button")[0].click();
    document.getElementsByTagName("button")[0].click();
    document.getElementsByTagName("button")[1].click();
};

export default file_list;