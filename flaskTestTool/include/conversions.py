#This is the conversion helper functions file.  It takes an input of an amount and a unit and then outputs in the requested units
class Conversions:
    def convert(self, amount, units, outUnits):
        gramToOunce = 0.035274
        ouncetoGram = 28.3495537056306
        inputAmount = amount
        inputUnits = units
        outputUnits = outUnits
        isMetricInput = self.checkMetric(inputUnits)
        isMetricOutput = self.checkMetric(outputUnits)
        #conversion logic checks
        if isMetricInput == True:
            madeSmall = self.makeSmallMetric(inputAmount, inputUnits)  #gets the number of units in smallest unit in metric
        else:
            madeSmall = self.makeSmallImperial(inputAmount, inputUnits) #gets the number of units in smallest unit in imperial

        if isMetricOutput == True: #metric output
            if isMetricInput == True: #metric to metric conversion
                converted = self.getOutputUnitsMetric(madeSmall, outputUnits)
            else:   #imperial to metric conversion
                madeSmall = madeSmall * ouncetoGram
                converted = self.getOutputUnitsMetric(madeSmall, outputUnits)
        else:   #imperial output
            if isMetricInput == False: #imperial to imperial conversion
                converted = self.getOutputUnitsImperial(madeSmall, outputUnits)
            else:
                madeSmall = madeSmall * gramToOunce #metric to imperial conversion
                converted = self.getOutputUnitsImperial(madeSmall, outputUnits)

        
        return [converted, outputUnits] #returns pair of values containing number of units and units

        #unit types: imperial (ounce, pound, cup, quart, gallon, floz, teaspoon, pint) and metric (liter, mililiter, gram, miligram, kilogram)

    def makeSmallImperial(self, inputAmount, inputUnits):
        if (inputUnits == "pound"):
            inputAmount = inputAmount * 16

        elif (inputUnits == "ounce"):
            inputAmount = inputAmount
        
        elif (inputUnits == "fluid ounces"):
            inputAmount = inputAmount
        
        elif (inputUnits == "gallon"):
            inputAmount = inputAmount * 128
        
        elif (inputUnits == "quart"):
            inputAmount = inputAmount * 32
        
        elif (inputUnits == "pint"):
            inputAmount = inputAmount * 16

        elif (inputUnits == "cup"):
            inputAmount = inputAmount * 8.11537

        return inputAmount
    
    def makeSmallMetric(self, inputAmount, inputUnits):
        if (inputUnits == "liter"):
            inputAmount = inputAmount * 1000

        elif(inputUnits == "milliliter"):
            inputAmount = inputAmount * 1
        
        elif(inputUnits == 'kilogram'):
            inputAmount = inputAmount * 1000
        
        elif(inputUnits == 'gram'):
            inputAmount = inputAmount * 1

        return inputAmount
    
    def getOutputUnitsImperial(self, madeSmall, outputUnits):
        unit = outputUnits
        
        if (unit == "pound"):
            madeSmall = madeSmall * 16
        
        elif (unit == "ounce"):
            madeSmall = madeSmall
        
        return madeSmall

    def getOutputUnitsMetric(self, madeSmall, outputUnits):
        unit = outputUnits

        if(unit == 'kilogram'):
            madeSmall

    def checkMetric(self, inputUnits):
        metricUnits = ['g', 'kg', 'gram', 'kilogram', 'l', 'liter', 'ml', 'mililiter']

        if metricUnits.__contains__(str(inputUnits).lower().strip().replace(' ', '')):
            return True
        
        else:
            return False
        

