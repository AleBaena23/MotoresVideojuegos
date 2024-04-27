Hey Ale, le he metido un rigidbody al plano (sin gravedad) para que sea
CANNON quien se ocupe de gestionar las colisiones. Aparte, he hecho que la
posición inicial de la pelota y la de reset esté contenida en un vector3 de THREE
para poder manejarlo todo más fácilmente.

Sin embargo, problemas:
    1. La longitud del rigidbody del plano es infinita. Lo suyo sería crear 
    un rigidbody de caja y metérsela al plano de THREE para que podamos ajustar
    su longitud y etc.

    2. No tenemos manera de ver el mundo de físicas (no tenemos CANNON_debugger). Antes de
    que te pongas a picar código, esto me gustaría hacerlo a mí. A ver si mañana
    puedes enseñarme un poco cómo hacerlo y dónde iría porque no tengo ni idea, 
    pero quiero hacerlo yo. Una vez hecho, hago la caja ajustada a las dimensiones del
    plano y ya por fin la bola podría caerse por los lados.
