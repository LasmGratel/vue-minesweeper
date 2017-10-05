<template>
  <div class="hello well container">
    <div class="container-fluid">
      <div class="row-fluid">
        <div class="col-md-3 col-sm-3">
            <div class="form-group">
              <label for="height">行数</label>
              <input id="height" type="number" class="form-control">
            </div>
            <div class="form-group">
              <label for="width">列数</label>
              <input id="width" type="number" class="form-control">
            </div>
            <div class="form-group">
              <label for="mine">雷数</label>
              <input id="mine" type="number" class="form-control">
            </div>
            <button v-on:click="reset();" class="btn btn-default">重置</button>
        </div>
        <div class="col-md-9">
        <table class="active">
          <tbody>
          <tr v-for="row in board">
            <td v-on:click="cellClick(cell);" v-on:contextmenu.prevent="cellRightClick(cell);" style="background-color: white;" v-bind:class="computeStyle(cell)" v-for="cell in row" v-bind:data-index="cell.x + '-' + cell.y">
              {{ compute(cell) }}
            </td>
          </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {CellType, Cell, Board} from '../game';

  let board = new Board();
  board.reset(9, 9, 1);

  export default {
    name: 'hello',
    data() {
      return {
        over: false
      }
    },
    computed: {
      board: function () {
        return board.board;
      }
    },
    methods: {
      reset: function () {
        board.reset(document.getElementById('height').value, document.getElementById('width').value, document.getElementById('mine').value);
        this.$forceUpdate();
      },
      compute: function (cell) {
        if (board.validate() && !this.$data.over) {
          alert('You won!');
          this.$data.over = true;
          board.traversCells((cell) => {
            cell.revealed = true;
          });
        }
        if (cell.revealed) {
          if (cell.type === CellType.BOMB) {
            return 'X';
          } else if (cell.type === CellType.NORMAL) {
            return cell.activeNeighbours;
          }
        } else if (cell.type === CellType.FLAG || cell.type === CellType.FLAGBOMB) {
          return '?';
        } else {
          return ' ';
        }
      },
      cellRightClick: function (cell) {
        if (!this.$data.over) {
          cell.mark();
          this.$forceUpdate();
        }
      },
      cellClick: function(cell) {
        if (!this.$data.over) {
          if (board.reveal(cell)) {
            this.$data.over = true;
            alert('You lose!');
          }
        }
        this.$forceUpdate();
      },
      computeStyle: function(cell) {
        if (cell.type === CellType.BOMB) {
          return 'bomb';
        } else if (cell.type === CellType.FLAG || cell.type === CellType.FLAGBOMB) {
          return 'mark';
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
