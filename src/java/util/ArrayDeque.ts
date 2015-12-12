/**
 * Created by linfaxin on 15/12/12.
 */
///<reference path="ArrayList.ts"/>

module java.util{

    export class ArrayDeque<E> extends ArrayList<E> {

        public addFirst(e:E):void {
            this.add(0, e);
        }
        public addLast(e:E):void {
            this.add(e);
        }

        public offerFirst(e:E):boolean {
            this.addFirst(e);
            return true;
        }
        public offerLast(e:E):boolean {
            this.addLast(e);
            return true;
        }
        removeFirst():E {
            let x = this.pollFirst();
            if(x==null) throw Error('NoSuchElementException');
            return x;
        }

        removeLast():E {
            let x = this.pollLast();
            if(x==null) throw Error('NoSuchElementException');
            return x;
        }

        pollFirst():E {
            return this.array.shift();
        }
        pollLast():E {
            return this.array.splice(this.array.length-1)[0];
        }
        getFirst():E {
            let x = this.peekFirst();
            if(x==null) throw Error('NoSuchElementException');
            return x;
        }
        getLast():E {
            let x = this.peekLast();
            if(x==null) throw Error('NoSuchElementException');
            return x;
        }
        peekFirst():E {
            return this.array[0];
        }
        peekLast():E {
            return this.array[this.array.length-1];
        }

        removeFirstOccurrence(o:any):boolean {
            if (o == null) return false;
            for(let i = 0, count=this.size(); i<count; i++){
                if(this.array[i]==o){
                    this.delete(i);
                    return true;
                }
            }
            return false;
        }
        removeLastOccurrence(o:any):boolean {
            if (o == null) return false;
            for(let i = this.size(); i>=0; i--){
                if(this.array[i]==o){
                    this.delete(i);
                    return true;
                }
            }
            return false;
        }

        offer(e:E):boolean {
            return this.offerLast(e);
        }
        remove():E {
            return this.removeFirst();
        }
        poll():E {
            return this.pollFirst();
        }
        element():E {
            return this.getFirst();
        }
        peek():E {
            return this.peekFirst();
        }
        push(e:E) {
            this.addFirst(e);
        }
        pop():E {
            return this.removeFirst();
        }

        private delete(i:number):boolean {
            if(i >= this.array.length) return false;
            this.array.splice(i, 1);
            return true;
        }




    }
}