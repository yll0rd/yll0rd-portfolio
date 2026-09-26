"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import SkillsSection from "@/components/skills-section";

export default function SkillsDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="text-link text-sm">
          View skills & technologies{" "}
          <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85dvh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-background shadow-xl">
          <div className="relative shrink-0 border-b border-border p-5 pr-16 sm:p-6 sm:pr-16">
            <Dialog.Title className="text-xl font-medium sm:text-2xl">
              Skills & technologies
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">
              The tools I work with, from machine learning to building and
              deploying applications.
            </Dialog.Description>
            <Dialog.Close
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close skills"
            >
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div
            className="min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6"
            tabIndex={0}
            role="region"
            aria-label="Skills list"
          >
            <SkillsSection compact />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
