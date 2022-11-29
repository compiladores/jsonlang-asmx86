.global main

.macro print_sp

        leaq    printsp(%rip), %rdi
        movq    %rbp, %rsi
        subq    %rsp, %rsi
        
        movq    $8, %rcx
        xorq    %rbx, %rbx
        movq    %rsi, %rax
        andq    $15, %rax
        testq   %rax, %rax
        cmovne  %rcx, %rbx
        subq    %rbx, %rsp
        call    printf
        addq    %rbx, %rsp     
.endm

string: .string "-8:%d; -16:%d; -24:%d; -32:%d\n"
main:
        pushq   %rbp
        movq    %rsp, %rbp
        subq    $8, %rsp 
        movq    $0, -8(%rbp)
        movq    $1, -16(%rbp)
        movq    $2, -24(%rbp)
        movq    $3, -32(%rbp)
        print_sp
        movq    $100, %rax
        pushq   %rax
        print_sp
        leaq    string(%rip), %rdi
        movq    -8(%rbp), %rsi
        movq    -16(%rbp), %rdx
        movq    -24(%rbp), %rcx
        movq    -32(%rbp), %r8
        
        subq    $0, %rsp
        call    printf
        movq    $0, %rax


        leave
        ret

// .global main

printsp: .string "rsp:%d\n"

// string: .string "-8:%d; -16:%d; -24:%d; -32:%d\n"



// main:
//         pushq   %rbp
//         movq    %rsp, %rbp
//         // subq    $, %rsp 
//         movq    $0, -8(%rbp)
//         movq    $1, -16(%rbp)
//         movq    $2, -24(%rbp)
//         movq    $3, -32(%rbp)
//         movq    $100, %rax
//         // print_sp
//         pushq   %rax
//         // movq    -24(%rbp), %rax
//         leaq    string(%rip), %rdi
//         movq    -8(%rbp), %rsi
//         movq    -16(%rbp), %rdx
//         movq    -24(%rbp), %rcx
//         movq    -32(%rbp), %r8
//         call    printf

//         leave
//         ret
