"use strict";

var template = [
  "<span class='st-block-positioner__selected-value'></span>",
  "<select class='st-block-positioner__select'></select>"
].join("\n");

var BlockPositionerSelect = function(mediator) {
  this.mediator = mediator;

  this._ensureElement();
  this._bindFunctions();

  this.initialize();
};

Object.assign(BlockPositionerSelect.prototype, require('./function-bind'), require('./renderable'), {

  total_blocks: 0,

  bound: ['onBlockCountChange', 'onSelectChange'],

  className: 'st-block-positioner__inner',

  initialize: function(){
    this.$el.append(template);
    this.$select = this.$('.st-block-positioner__select');
    this.$positioner = null;

    this.$select.on('change', this.onSelectChange);
  },

  onBlockCountChange: function(new_count) {
    if (new_count !== this.total_blocks) {
      this.total_blocks = new_count;
      this.renderPositionList();
    }
  },

  onSelectChange: function() {
    var val = this.$select.val();
    if (val !== 0) {
      this.mediator.trigger(
        "block:changePosition", this.$positioner.$block, val,
        (val === 1 ? 'before' : 'after'));
      this.$positioner.toggle();
    }
  },

  renderPositionList: function() {
    var inner = "<option value='0'>" + i18n.t("general:position") + "</option>";
    for(var i = 1; i <= this.total_blocks; i++) {
      inner += "<option value="+i+">"+i+"</option>";
    }
    this.$select.html(inner);
  },

  renderInBlock: function(positioner) {
    // hide old
    if (this.$positioner && this.$positioner !== positioner) {
      this.$positioner.hide();
    }
    // add new
    this.$positioner = positioner;
    this.$select.val(0);
    positioner.$el.append(this.$el.detach());
  }

});

module.exports = BlockPositionerSelect;
