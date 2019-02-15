window.States = function () {
  var self = this
  var stator = new window.StateMan()

  var exploreState = new window.ExploreState()
  var tourState = new window.TourState()

  self.go = function (state, params) {
    console.log(state)
    APP.state = state
    var options = {
      encode: false
    }
    if (params) options.params = params
    stator.go(state, options)
  }

  self.start = function (options) {
    stator.start(options)
  }

  stator.state({
    'explore': exploreState,
    'tour': tourState
  })

  return self
}
