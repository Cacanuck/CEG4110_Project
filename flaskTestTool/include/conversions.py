#This is the conversion helper functions file.  It takes an input of an amount and a unit and then outputs in the requested units

#TODO: 
## Catch liquid units and only convert to other liquid units
## Lots of testing
## Catch all variants of unit names
#End TODO
class Conversions:
    def convert(self, amount, units, outUnits):
        gramToOunce = 0.035274
        ouncetoGram = 28.3495537056306
        inputAmount = amount
        inputUnits = units
        outputUnits = outUnits
        isMetricInput = self.checkMetric(inputUnits)
        isMetricOutput = self.checkMetric(outputUnits)
        isSpoonsInput = self.checkSpoons(inputUnits)
        isSpoonsOutput = self.checkSpoons(outputUnits)
        #conversion logic checks
        if isMetricInput == True:
            madeSmall = self.makeSmallMetric(inputAmount, inputUnits)  #gets the number of units in smallest unit in metric
        else:
            if isSpoonsInput == True: 
                madeSmall = self.makeSmallSpoons(inputAmount, inputUnits)
            else:
                madeSmall = self.makeSmallImperial(inputAmount, inputUnits) #gets the number of units in smallest unit in imperial

        if isMetricOutput == True: #metric output
            if isMetricInput == True: #metric to metric conversion
                converted = self.getOutputUnitsMetric(madeSmall, outputUnits)
            else:   #imperial to metric conversion
                madeSmall = madeSmall * ouncetoGram
                converted = self.getOutputUnitsMetric(madeSmall, outputUnits)
        elif isSpoonsOutput == True: #spoons output
            if isMetricInput == True:
                converted = self.getOutputUnitsSpoonsMetric(madeSmall, outputUnits)
            else:
                converted = self.getOutputUnitsSpoonsImperial(madeSmall, outputUnits)
        else:   #imperial output
            if isMetricInput == False: #imperial to imperial conversion
                converted = self.getOutputUnitsImperial(madeSmall, outputUnits)
            else:
                madeSmall = madeSmall * gramToOunce #metric to imperial conversion
                converted = self.getOutputUnitsImperial(madeSmall, outputUnits)

        
        return [converted, outputUnits] #returns pair of values containing number of units and units

        #unit types: imperial (ounce, pound, cup, quart, gallon, floz, teaspoon, pint) and metric (liter, mililiter, gram, miligram, kilogram)

    def makeSmallSpoons(self, inputAmount, inputUnits):
        if(inputUnits == "teaspoon" or "tsp"):
            inputAmount = inputAmount * 0.166667

        elif(inputUnits == "tablespoon" or "tbsp"):
            inputAmount = inputAmount * 0.5

            return inputAmount

    def makeSmallImperial(self, inputAmount, inputUnits):
        if (inputUnits == "pound" or "lbs" or "lb"):
            inputAmount = inputAmount * 16

        elif (inputUnits == "ounce" or "oz"):
            inputAmount = inputAmount
        
        elif (inputUnits == "fluid ounces" or "floz"):
            inputAmount = inputAmount
        
        elif (inputUnits == "gallon" or "gal"):
            inputAmount = inputAmount * 128
        
        elif (inputUnits == "quart" or "qt"):
            inputAmount = inputAmount * 32
        
        elif (inputUnits == "pint" or "pt" or "pnt" or "p"):
            inputAmount = inputAmount * 16

        elif (inputUnits == "cup" or "cp" or "c"):
            inputAmount = inputAmount * 8.11537

        return inputAmount
    
    def makeSmallMetric(self, inputAmount, inputUnits):
        if (inputUnits == "liter" or "l"):
            inputAmount = inputAmount * 1000

        elif(inputUnits == "milliliter" or "ml"):
            inputAmount = inputAmount * 1
        
        elif(inputUnits == 'kilogram' or "kg"):
            inputAmount = inputAmount * 1000
        
        elif(inputUnits == 'gram' or "g"):
            inputAmount = inputAmount * 1

        return inputAmount
    
    def getOutputUnitsImperial(self, madeSmall, outputUnits):
        unit = outputUnits
        
        if (unit == "pound" or "lbs" or "lb"):
            madeSmall = madeSmall * 16
        
        elif (unit == "ounce" or "oz"):
            madeSmall = madeSmall
        
        return madeSmall

    def getOutputUnitsMetric(self, madeSmall, outputUnits):
        unit = outputUnits

        if(unit == 'kilogram' or "kg"):
            madeSmall = madeSmall / 1000

        elif(unit == 'gram' or "g"):
            madeSmall = madeSmall
        
        elif(unit == "liter" or "l"):
            madeSmall = madeSmall / 1000

        elif(unit == "milliliter" or "ml"):
            madeSmall = madeSmall

        return madeSmall

    def getOutputUnitsSpoonsImperial(self, madeSmall, outputUnits):
        unit = outputUnits

        if(unit == "teaspoon" or "tsp"):
            madeSmall = madeSmall * 6

        elif(unit == "tablespoon" or "tbsp"):
            madeSmall = madeSmall * 2

        return madeSmall

    def getOutputUnitsSpoonsMetric(self, madeSmall, outputUnits):
        unit = outputUnits
        
        if(unit == "teaspoon" or "tsp"):
            madeSmall = madeSmall * 0.202884
        
        elif(unit == "tablespoon" or "tbsp"):
            madeSmall = madeSmall * 0.067628

        return madeSmall

    def checkMetric(self, inputUnits):
        metricUnits = ['g', 'kg', 'gram', 'kilogram', 'l', 'liter', 'ml', 'mililiter']

        if metricUnits.__contains__(str(inputUnits).lower().strip().replace(' ', '')):
            return True
        
        else:
            return False
        
    def checkSpoons(self, inputUnits):
        spoons = ["tsp", "teaspoon", "tbsp", "tablespoon"]

        if spoons.__contains__(str(inputUnits).lower().strip().replace(' ', '')):
            return True
        
        else:
            return False
