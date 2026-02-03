"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { AlertCircle, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">出错了</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {this.state.error?.message || "发生了意外错误"}
            </p>
          </div>
          <Button onClick={this.handleReset} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            重试
          </Button>
        </motion.div>
      )
    }

    return this.props.children
  }
}
