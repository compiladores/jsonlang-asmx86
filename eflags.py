# Usado para, en el momento de debuggear, ver el estado de los flags
# a partir del valor del registro eflags 
# Se debe escribir el numero del flag en formato hexadecimal, sin el 0x.

while(1):
    numero = int(input("0x"), 16)
    
    
    print("carry (CF):\t", int((numero&(1*2**0))/2**0))
    print("equal (ZF):\t", int((numero&(1*2**6))/2**6))
    print("negative (SF):\t", int((numero&(1*2**7))/2**7))
    print("overflow (OF):\t", int((numero&(1*2**11))/2**11))
    print()