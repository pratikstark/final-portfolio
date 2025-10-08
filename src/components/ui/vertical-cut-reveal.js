'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

const VerticalCutReveal = forwardRef(({
  children,
  reverse = false,
  transition = {
    type: "spring",
    stiffness: 190,
    damping: 22,
  },
  splitBy = "words",
  staggerDuration = 0.2,
  staggerFrom = "first",
  containerClassName,
  wordLevelClassName,
  elementLevelClassName,
  onClick,
  onStart,
  onComplete,
  autoStart = true,
  ...props
}, ref) => {
  const containerRef = useRef(null)
  // Extract text content from children, handling both strings and React elements
  const text = useMemo(() => {
    if (typeof children === "string") return children
    if (React.isValidElement(children)) {
      // Handle React elements by extracting text from their content
      if (typeof children.props.children === "string") return children.props.children
      return children.props.children?.toString() || ""
    }
    return children?.toString() || ""
  }, [children])
  const [isAnimating, setIsAnimating] = useState(false)

  // Split text into characters with Unicode and emoji support
  const splitIntoCharacters = (text) => {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })
      return Array.from(segmenter.segment(text), ({ segment }) => segment === ' ' ? '\u00A0' : segment)
    }
    return Array.from(text).map(char => char === ' ' ? '\u00A0' : char)
  }

  // Split text based on splitBy parameter
  const elements = useMemo(() => {
    if (!text || text.trim() === "") {
      console.warn('VerticalCutReveal: Empty text provided')
      return []
    }

    const words = text.split(" ")
    if (splitBy === "characters") {
      const result = words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }))
      console.log('VerticalCutReveal characters split result:', result)
      return result
    }

    const result = splitBy === "words"
      ? text.split(" ")
      : splitBy === "lines"
        ? text.split("\n")
        : text.split(splitBy)
    console.log('VerticalCutReveal split result:', result, 'for splitBy:', splitBy)
    return result
  }, [text, splitBy])

  // Calculate stagger delays
  const getStaggerDelay = useCallback(
    (index) => {
      const total =
        splitBy === "characters"
          ? elements.reduce(
              (acc, word) =>
                acc +
                (typeof word === "string"
                  ? 1
                  : word.characters.length + (word.needsSpace ? 1 : 0)),
              0
            )
          : elements.length
      if (staggerFrom === "first") return index * staggerDuration
      if (staggerFrom === "last") return (total - 1 - index) * staggerDuration
      if (staggerFrom === "center") {
        const center = Math.floor(total / 2)
        return Math.abs(center - index) * staggerDuration
      }
      if (staggerFrom === "random") {
        const randomIndex = Math.floor(Math.random() * total)
        return Math.abs(randomIndex - index) * staggerDuration
      }
      return Math.abs(staggerFrom - index) * staggerDuration
    },
    [elements.length, staggerFrom, staggerDuration]
  )

  const startAnimation = useCallback(() => {
    console.log('🎬 VerticalCutReveal startAnimation called!')
    console.log('📝 Text:', text)
    console.log('👶 Children:', children)
    console.log('🔄 Current isAnimating state:', isAnimating)
    console.log('⚙️ splitBy:', splitBy)
    console.log('⏱️ staggerDuration:', staggerDuration)
    console.log('🎯 staggerFrom:', staggerFrom)
    console.log('🔄 autoStart:', autoStart)
    setIsAnimating(true)
    onStart?.()
  }, [onStart, text, children, isAnimating, splitBy, staggerDuration, staggerFrom, autoStart])

  useImperativeHandle(ref, () => ({
    startAnimation,
    reset: () => setIsAnimating(false),
  }))

  useEffect(() => {
    if (autoStart && text) {
      console.log('🚀 VerticalCutReveal autoStart triggered!')
      console.log('📝 Text:', text)
      console.log('🔄 AutoStart:', autoStart)
      console.log('📊 Elements count:', elements.length)
      // Small delay to ensure component is properly mounted
      const timer = setTimeout(() => {
        console.log('⏰ AutoStart timer fired, calling startAnimation')
        startAnimation()
      }, 100)
      return () => clearTimeout(timer)
    } else {
      console.log('⚠️ AutoStart conditions not met:', { autoStart, text, elementsCount: elements?.length })
    }
  }, [autoStart, text, startAnimation, elements])

  const variants = {
    hidden: { y: reverse ? "-100%" : "100%" },
    visible: (i) => ({
      y: 0,
      transition: {
        ...transition,
        delay: ((transition?.delay) || 0) + getStaggerDelay(i),
      },
    }),
  }

  console.log('VerticalCutReveal rendering with text:', text, 'isAnimating:', isAnimating, 'elements:', elements)

  return (
    <span
      className={cn(
        containerClassName,
        "flex flex-wrap whitespace-pre-wrap",
        splitBy === "lines" && "flex-col"
      )}
      onClick={onClick}
      ref={containerRef}
      {...props}
    >

      {(splitBy === "characters"
        ? elements
        : elements.map((el, i) => ({
            characters: [el],
            needsSpace: i !== elements.length - 1,
          }))
      ).map((wordObj, wordIndex, array) => {
        const previousCharsCount = array
          .slice(0, wordIndex)
          .reduce((sum, word) => sum + word.characters.length, 0)

        return (
          <span
            key={wordIndex}
            aria-hidden="true"
            className={cn("inline-flex overflow-hidden", wordLevelClassName)}
          >
            {wordObj.characters.map((char, charIndex) => (
              <span
                className={cn(
                  elementLevelClassName,
                  "whitespace-pre-wrap relative"
                )}
                key={charIndex}
              >
                <motion.span
                  custom={previousCharsCount + charIndex}
                  initial="hidden"
                  animate={isAnimating ? "visible" : "hidden"}
                  variants={variants}
                  onAnimationComplete={
                    wordIndex === elements.length - 1 &&
                    charIndex === wordObj.characters.length - 1
                      ? onComplete
                      : undefined
                  }
                  className="inline-block"
                >
                  {char}
                </motion.span>
              </span>
            ))}
            {wordObj.needsSpace && <span> </span>}
          </span>
        )
      })}
    </span>
  )
})

VerticalCutReveal.displayName = "VerticalCutReveal"

export { VerticalCutReveal }
