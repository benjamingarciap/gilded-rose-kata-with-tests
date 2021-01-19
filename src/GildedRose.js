class Decayer{
  sellInSubtractor(item) {
    item.sellIn --;
  }
  specialItemsDecay(item, min, max) {  //<======== special cases
    switch(item.name) {
      case 'Sulfuras, Hand of Ragnaros': 
        item.sellIn = item.sellIn;
        item.quality = 80;
      break;
      case 'Conjured Mana Cake':
        this.oneDayQualityDecay(item, min, 2);
      break;
    }
  }

  oneDayQualityDecay(item, min, factor) {
    this.sellInSubtractor(item)
    if(item.quality <= min) {  //<======== quality can't be less than MIN_BOUNDERY
      item.quality = min;
    }
    else if(item.sellIn <= 0) {  //<======== quality decreases twice as fast when we have passed the sellIn date
      factor ? item.quality -= 2 * factor : item.quality -= 2;  //<======== ternary checks if is conjured
    }
    else {  //<======== regular decrease
      factor ? item.quality -= 1 * factor : item.quality -= 1;  //<======== ternary checks if is conjured
    };
  };

  oneDayQualityGrowth(item, max) {
    this.sellInSubtractor(item)
    if(item.sellIn <= 0) {  //<======== quality drops to 0 after the concert
      item.quality = 0;
    } 
    else if(item.sellIn <= 5) { //<======== quality increases by 3 when there are 5 days or less
      item.quality += 3;
    } 
    else if(item.sellIn <= 10) { //<======== quality increases by 2 when there are 5 days or less
      item.quality += 2;
    }
    else {
      item.quality ++; //<======== regular increase
    };

    if(item.quality >= max) { //<======== quality can't be more than MIN_BOUNDERY
      item.quality = 50;
    };
  };
};

class GildedRose extends Decayer {
  constructor() {
    super();
    this.MAX_BOUND = 50;
    this.MIN_BOUND = 0;
  };
  updateQuality(items) {
    items.map((item) => {
      if(item.name.includes('Sulfuras, Hand of Ragnaros') || item.name.includes('Conjured Mana Cake')) {
        this.specialItemsDecay(item, this.MIN_BOUND, this.MAX_BOUND)
      }
      else if(item.name.includes('Aged Brie') || item.name.includes('Backstage passes to a TAFKAL80ETC concert' )) {
        this.oneDayQualityGrowth(item, this.MAX_BOUND)
      }
      else {
        this.oneDayQualityDecay(item, this.MIN_BOUND)
      };
    });
    return items;
  };
  timeStarter(items, days) {
    for(let i = 0; i < days; i++){
      this.updateQuality(items);
    };
    return items;
  };
};

const Items = [
  new Item("+5 Dexterity Vest", 10, 20),
  new Item("Aged Brie", 2, 47),
  new Item("Elixir of the Mongoose", 5, 7),
  new Item("Sulfuras, Hand of Ragnaros", 0, 80),
  new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
  new Item("Conjured Mana Cake", 3, 6)
];

const gildedRose = new GildedRose();

// console.log(gildedRose.timeStarter(Items, 12));