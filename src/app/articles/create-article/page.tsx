"use client";

import Button from "@/components/Button";
import LinkButton from "@/components/LinkButton";
import Tile from "@/components/Tile";
import { Draft } from "@/lib/types";
import { useState } from "react";

export default function CreatePage() {

  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);


  async function openDrafts() {
    setLoading(true);

    try {
      const res = await fetch("/api/articles/draft");
      const data = (await res.json()) as Draft[];

      setDrafts(data);
      setShowDrafts(true);
    } catch (err) {
      console.error(err);
      setDrafts([]);
      setShowDrafts(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="
      min-h-[90vh]
      flex
      items-center justify-center
    ">
      <Tile 
        disableHover={true}
        className="flex-0 min-w-fit p-[5%]"
      >
        <div className="
          flex flex-col 
          w-64 gap-10
          self-center
        ">
          <LinkButton 
            text="Create New Article" 
            link="/articles/create-article/create-new-article"
            className="w-full"
          />
          <Button
            text="Load Existing Article"
            className="w-full"
            onClick={openDrafts}
          />          
        </div>          
      </Tile>

      {showDrafts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">

            <h2 className="text-lg font-bold mb-4">
              Select a Draft
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="flex flex-col gap-4">
                {drafts.map((d) => (
                  <Button
                    text={d.title}
                    key={d.id}
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setShowDrafts(false);
                      window.location.href =
                        `/articles/create-article/load-draft?id=${d.id}`;
                    }}
                  />
                ))}
                <Button
                  text="Close"
                  variant="red"
                  className="self-end"
                  onClick={() => setShowDrafts(false)}
                />                
              </div>
            )}



          </div>
        </div>
      )}
    </div>

  );
}