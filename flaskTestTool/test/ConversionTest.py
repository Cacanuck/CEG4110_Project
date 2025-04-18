import conversions

def main():
    testArray = [
        [1, 'gallon', 'cup'],
        [1, 'gallon', 'ml'],
        [1, 'gallon', 'milliliter'],
        [1, 'gallon', 'milli liter'],
        [1, 'gal', 'cup'],
        [1, 'ga l', 'cup'],
        [1, 'gal', 'quart'],
        [1, 'gallon', 'liter'],
        [1, 'liter', 'milliliter'],
        [1, 'l', 'liter'],
        

    ]
    answerArray = [
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        [16, 'cup'],
        
    ]

if __name__ == '__main__':
    main()
