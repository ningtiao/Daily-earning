function doSomethingCool () {
  var helper = (typeof FeatureXYZ !== 'undefined') ? FeatureXYZ : Function() { }
  var val = helper()
}