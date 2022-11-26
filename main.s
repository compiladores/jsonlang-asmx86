.LC2:
        .string "xmm0: %f, xmm1: %f, xmm2: %f, 2nd int: %d\n"
.global main
main:
        pushq   %rbp
        movq    %rsp, %rbp
        subq    $32, %rsp
        movsd   .LC0(%rip), %xmm0
        movsd   %xmm0, -8(%rbp)
        movsd   .LC1(%rip), %xmm0
        movsd   %xmm0, -16(%rbp)
        movsd   -16(%rbp), %xmm0
        movq    -8(%rbp), %rax
        movapd  %xmm0, %xmm1
        movq    %rax, %xmm0
        call    pow@PLT
        movq    %xmm0, -24(%rbp)

        xorpd	%xmm0, %xmm0
        xorpd	%xmm1, %xmm1
        

        movq    -24(%rbp), %xmm0
        movq	.LC0(%rip), %xmm1
        movq	.LC1(%rip), %xmm2
        leaq    .LC2(%rip), %rdi
	movq	$10, %rsi
        mov     $1, %al
	call 	printf

        movsd   -24(%rbp), %xmm0
        cvttsd2sil      %xmm0, %eax
        leave
        ret
.LC0:
        .long   0
        .long   1073741824
.LC1:
        .long   0
        .long   1074266112
