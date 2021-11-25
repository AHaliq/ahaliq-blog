---
title: Homotopy Type Theory book (HoTT book) notes
author: Abdul Haliq
tags: mathematics, homotopy type theory, type theory, logic
teaser: Some notes as I'm reading through the HoTT book
---

**WORK IN PROGRESS**


\\[ \\ln x = \\int_{-\\infty}^x \\frac 1 y \\, dy . \\]

# Chapter 1 Type Theory

## 1.1 Type Theory versus set theory
- introduction
  - type theory uses judgements to specify term and type; terms cannot exist without a type, its existence implies its type's existence
  - type theory is a form of logic unlike set theory which is built ontop of first order logic
  - proving a theorem is checking the existence of a term in a type; object construction
- there are at least two equalities in type theory
  - propositional equality: an identity type between two terms is a type, and its inhibition is a proof of the equality of the two terms
  - judgemental equality: an algorithmically decidable / normalization process to show that the two are the same judgement
    - if `A` is judgementall equal to `B`, and we have the judgement `a:A` then we can derive `a:B`
- there are two types judgements
  - `a:A`; `a` is an object of type `A`
  - `a≡b:A`; `a` and `b` are definitionally equal objects of type `A`
    - two definitionally equal expressions can be expressed via `a :≡ b`
- context are an ordered list of judgements we use as an assumption
  - to form the judgement `m + n : N` we need to assume `m : N` and `n : N`

## 1.2 Function Types
- the type of functions from domain `A` to codomain `B` is `A → B`
- they are not defined as functional relations as in set theory; they are primitive and defined by how we use them (elimination rule) and how to construct them (introduction rule)
  - introduction 
    - `f(x) :≡ Φ` definitionally assigning to an expression which uses x
    - `λ(x : A). Φ)` via lambda expressions
    - `x ↦ Φ` via mapsto syntax
    - `g(x,-)` via anonymous arguments
- binders maps the arguments defined in the abstraction and the expression
  - use alpha renaming to avoid semantically incorrect captures
  - use products to express multi argument functions
  - use currying to transform product arguments to single argument functions returning functions

## 1.3 Universes and families
- in naive set theory the universe of all types is `U_∞`
  - this introduces paradoxes
- we avoid this by using a hierarchy of universes
  - `U_0 : U_1 : U_2 : ...`
  - the universe is cumulative; forall `A : U_i`, `A : U_i+1`
  - thus terms don't have unique types
  - typical ambiguity is when we omit the universe's index and assume the indices have been assigned in a consistent manner
- dependency types are a term indexed family of types
  - `A → U`
  - types in `U` are referred to small types
  - a constant type family is `B : U ⊢ λ(x : A). B : A → U`
  - the indices for universe are not integers and we cannot define the function from integer to universe at index of that integer

## 1.4 Dependent Function Types
- dependent function types
  - generalized functions where codomain's type varies dependeing on the element of the domain
  - can be regarded as cartesian product over a given type
  - `A : U, B : A → U ⊢ ∏(x:A), B(x)`
  - if `B` is a constant family it is simply the function type
    - `∏(x:A)B ≡ (A → B)`
  - introduction: via lambda expressions
  - elimination: via beta reduction
- polymorphic function
  - dependent function where the term argument is a type

## 1.5 Product Types
- product type
  - type of product of two types
  - `A × B : U`
  - `(a,b) : A × B`
  - remember these are primitive concept and not like a set of relations in set theory
- unit type
  - type with only one term
  - `1 : U`
  - `* : 1`

### How to specify a type

i. Formation Rule; rule to define new type judgements
    - `U_i : U_i+1`
    - `A : U`
    - `A : U, B : U ⊢ A → B`
    - `A : U, B : A → U ⊢ ∏(x:A), B(x)`
    - `A : U, B : U ⊢ A × B : U`
    - `1 : U`
ii. Introduction Rule; rule to define term of a type
    - `A : U_i ⊢ A : U_i+1`
    - `a : A`
    - `λ(x : A). Φ : A → B`
    - `λ(x : A). Φ : ∏(x:A), B(x)`
    - `a : A, b : B ⊢ (a,b) : A × B`
    - `* : 1`
iii. Elimnation Rule
    - `(λ(x : A). Φ)(a) : B`
    - `rec_A × B : ∏(C:U), (A → B → C) → A × B → C`
      - rec_A × B(C,g,(a,b)) :≡ g(a)(b)`
      - `pr_1 :≡ rec_A × B(A,λa.λb.a)`
      - `pr_2 :≡ rec_A × B(B,λa.λb.b)`
    - `rec_1 : ∏(C:U), C → 1 → C`
      - `rec_1(C,c,*) :≡ c`
    - we often use recursor functions to define eliminators to map out of the data structure
    - we can define the recursor first to derive eliminators or we could define recursors and use that to derive a recursor
    - 
iv. Computation Rule
    - `Φ / a : B`
v. Uniqueness Principle
    - a function that expresses uniqueness of terms into or out of the type via Computation and Formation
    - it is used as a rule for judgemental equality
    - otherwise it is for propositional equality; propositional uniqueness principle